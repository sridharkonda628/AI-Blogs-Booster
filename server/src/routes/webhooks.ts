import express from 'express';
import Stripe from 'stripe';
import { supabase } from '@/config/supabase';
import { asyncHandler } from '@/middleware/errorHandler';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// @desc    Handle Stripe webhooks
// @route   POST /api/webhooks/stripe
// @access  Public (but verified)
router.post('/stripe', express.raw({ type: 'application/json' }), asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'] as string;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object as Stripe.Checkout.Session;
      await handleSuccessfulPayment(session);
      break;

    case 'customer.subscription.updated':
      const subscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionUpdate(subscription);
      break;

    case 'customer.subscription.deleted':
      const deletedSubscription = event.data.object as Stripe.Subscription;
      await handleSubscriptionCancellation(deletedSubscription);
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  res.json({ received: true });
}));

async function handleSuccessfulPayment(session: Stripe.Checkout.Session) {
  const clerkId = session.metadata?.clerkId;
  
  if (!clerkId) {
    console.error('No clerkId in session metadata');
    return;
  }

  // Update user to premium
  const { error } = await supabase
    .from('user_profiles')
    .update({ 
      role: 'premium',
      ai_usage_count: 0, // Reset AI usage
      ai_usage_reset_date: new Date().toISOString()
    })
    .eq('clerk_id', clerkId);

  if (error) {
    console.error('Failed to upgrade user to premium:', error);
  } else {
    console.log(`User ${clerkId} upgraded to premium`);
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const clerkId = subscription.metadata?.clerkId;
  
  if (!clerkId) return;

  const isActive = subscription.status === 'active';
  const role = isActive ? 'premium' : 'user';

  const { error } = await supabase
    .from('user_profiles')
    .update({ role })
    .eq('clerk_id', clerkId);

  if (error) {
    console.error('Failed to update subscription status:', error);
  }
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  const clerkId = subscription.metadata?.clerkId;
  
  if (!clerkId) return;

  const { error } = await supabase
    .from('user_profiles')
    .update({ role: 'user' })
    .eq('clerk_id', clerkId);

  if (error) {
    console.error('Failed to downgrade user:', error);
  }
}

// @desc    Handle Clerk webhooks
// @route   POST /api/webhooks/clerk
// @access  Public (but verified)
router.post('/clerk', asyncHandler(async (req, res) => {
  const { type, data } = req.body;

  switch (type) {
    case 'user.created':
      await handleUserCreated(data);
      break;
    
    case 'user.updated':
      await handleUserUpdated(data);
      break;
    
    case 'user.deleted':
      await handleUserDeleted(data);
      break;
    
    default:
      console.log(`Unhandled Clerk event type: ${type}`);
  }

  res.json({ received: true });
}));

async function handleUserCreated(userData: any) {
  const { id: clerkId, email_addresses, first_name, last_name, image_url } = userData;
  
  const primaryEmail = email_addresses.find((email: any) => email.id === userData.primary_email_address_id);
  
  if (!primaryEmail) return;

  const userProfile = {
    clerk_id: clerkId,
    email: primaryEmail.email_address,
    name: `${first_name || ''} ${last_name || ''}`.trim() || primaryEmail.email_address.split('@')[0],
    avatar: image_url,
    role: 'user',
    ai_usage_count: 0,
    ai_usage_reset_date: new Date().toISOString()
  };

  const { error } = await supabase
    .from('user_profiles')
    .insert([userProfile]);

  if (error) {
    console.error('Failed to create user profile:', error);
  }
}

async function handleUserUpdated(userData: any) {
  const { id: clerkId, email_addresses, first_name, last_name, image_url } = userData;
  
  const primaryEmail = email_addresses.find((email: any) => email.id === userData.primary_email_address_id);
  
  if (!primaryEmail) return;

  const updates = {
    email: primaryEmail.email_address,
    name: `${first_name || ''} ${last_name || ''}`.trim() || primaryEmail.email_address.split('@')[0],
    avatar: image_url
  };

  const { error } = await supabase
    .from('user_profiles')
    .update(updates)
    .eq('clerk_id', clerkId);

  if (error) {
    console.error('Failed to update user profile:', error);
  }
}

async function handleUserDeleted(userData: any) {
  const { id: clerkId } = userData;

  // Delete user's blogs and comments
  await supabase.from('comments').delete().eq('author_id', clerkId);
  await supabase.from('blogs').delete().eq('author_id', clerkId);
  
  // Delete user profile
  const { error } = await supabase
    .from('user_profiles')
    .delete()
    .eq('clerk_id', clerkId);

  if (error) {
    console.error('Failed to delete user profile:', error);
  }
}

export default router;
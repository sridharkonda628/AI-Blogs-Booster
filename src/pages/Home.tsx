import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Sparkles, 
  Zap, 
  Target, 
  Users, 
  TrendingUp, 
  Shield,
  ArrowRight,
  CheckCircle,
  Star,
  Rocket
} from 'lucide-react';

export default function Home() {
  const { isSignedIn, user } = useUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse-glow"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2 mb-6 animate-float">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-purple-300 text-sm font-medium">AI-Powered Content Creation</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent animate-gradient-x">
              AI Blogs Booster
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Supercharge Your Content Creation with AI-Powered Writing, SEO Optimization, and Smart Analytics
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isSignedIn ? (
                <Link to="/dashboard">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse-glow">
                    <Rocket className="w-5 h-5 mr-2" />
                    Go to Dashboard
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/pricing">
                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse-glow">
                      <Rocket className="w-5 h-5 mr-2" />
                      Start Creating
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 px-8 py-4 text-lg font-semibold rounded-xl transform hover:scale-105 transition-all duration-300">
                    Watch Demo
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Powerful Features for Content Creators
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Everything you need to create, optimize, and publish amazing blog content
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Zap,
                title: "AI Writing Assistant",
                description: "Generate high-quality content with advanced AI that understands your style and audience",
                color: "from-yellow-400 to-orange-500"
              },
              {
                icon: Target,
                title: "SEO Optimization",
                description: "Automatically optimize your content for search engines with smart keyword suggestions",
                color: "from-green-400 to-emerald-500"
              },
              {
                icon: TrendingUp,
                title: "Analytics Dashboard",
                description: "Track performance, engagement, and growth with detailed analytics and insights",
                color: "from-blue-400 to-cyan-500"
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Work together with your team, share drafts, and manage content workflows",
                color: "from-purple-400 to-pink-500"
              },
              {
                icon: Shield,
                title: "Content Moderation",
                description: "Built-in moderation tools to ensure quality and compliance across all content",
                color: "from-red-400 to-rose-500"
              },
              {
                icon: Sparkles,
                title: "Smart Templates",
                description: "Choose from AI-generated templates optimized for different content types and industries",
                color: "from-indigo-400 to-purple-500"
              }
            ].map((feature, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300 transform hover:scale-105 hover:shadow-xl animate-slide-up group" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 animate-float group-hover:animate-pulse`}>
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-white text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-400 text-base leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-slate-800/30">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Content Creators", icon: Users },
              { number: "50K+", label: "Articles Generated", icon: Sparkles },
              { number: "95%", label: "SEO Score Improvement", icon: TrendingUp },
              { number: "24/7", label: "AI Assistant Available", icon: Zap }
            ].map((stat, index) => (
              <div key={index} className="animate-slide-up" style={{ animationDelay: `${index * 150}ms` }}>
                <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-xl p-6 border border-purple-500/20 hover:border-purple-500/40 transition-all duration-300 transform hover:scale-105 group">
                  <stat.icon className="w-8 h-8 text-purple-400 mx-auto mb-4 animate-float group-hover:animate-pulse" />
                  <div className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 font-medium">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">
              Loved by Content Creators
            </h2>
            <p className="text-xl text-gray-400">
              See what our users are saying about AI Blogs Booster
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Content Strategist",
                content: "AI Blogs Booster transformed my content creation process. I can now produce high-quality articles 3x faster!",
                rating: 5
              },
              {
                name: "Mike Chen",
                role: "Digital Marketer",
                content: "The SEO optimization features are incredible. My blog traffic increased by 200% in just 2 months.",
                rating: 5
              },
              {
                name: "Emily Rodriguez",
                role: "Freelance Writer",
                content: "The AI writing assistant feels like having a professional editor by my side. Absolutely game-changing!",
                rating: 5
              }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-slate-800/50 border-slate-700/50 hover:bg-slate-800/70 transition-all duration-300 transform hover:scale-105 animate-slide-up group" style={{ animationDelay: `${index * 200}ms` }}>
                <CardHeader>
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400 animate-float" style={{ animationDelay: `${i * 100}ms` }} />
                    ))}
                  </div>
                  <CardDescription className="text-gray-300 text-base leading-relaxed">
                    "{testimonial.content}"
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold animate-pulse-glow">
                      {testimonial.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-white font-semibold">{testimonial.name}</div>
                      <div className="text-gray-400 text-sm">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-blue-600/10"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent animate-gradient-x">
              Ready to Boost Your Content?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join thousands of content creators who are already using AI to supercharge their blogs
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isSignedIn ? (
                <Link to="/create">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse-glow">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Create Your First Blog
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              ) : (
                <Link to="/pricing">
                  <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 animate-pulse-glow">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              )}
            </div>
            
            <div className="mt-8 flex items-center justify-center gap-6 text-gray-400">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Free 7-day trial</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
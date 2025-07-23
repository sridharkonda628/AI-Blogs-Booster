import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({
        error: 'Validation Error',
        details: error.details.map(detail => detail.message)
      });
    }
    next();
  };
};

// Validation schemas
export const blogSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  content: Joi.string().min(50).required(),
  excerpt: Joi.string().max(500).required(),
  category: Joi.string().required(),
  tags: Joi.array().items(Joi.string()).max(10),
  thumbnail: Joi.string().uri().optional(),
  status: Joi.string().valid('draft', 'published', 'pending').default('draft')
});

export const commentSchema = Joi.object({
  content: Joi.string().min(1).max(1000).required(),
  blogId: Joi.string().required()
});

export const userUpdateSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  bio: Joi.string().max(500).optional(),
  avatar: Joi.string().uri().optional()
});
/**
 * Zod validation schemas for Smart Block Project
 */

import { z } from 'zod';

// Available categories
export const CATEGORIES = [
  'Technology',
  'E-Commerce',
  'Education',
  'Health & Fitness',
  'Finance',
  'Entertainment'
] as const;

// Available colors
export const COLORS = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-orange-500',
  'bg-pink-500',
  'bg-indigo-500'
] as const;

// URL validation schema
const urlSchema = z.string().url({ message: 'Please enter a valid URL' });

// Create block schema
export const createBlockSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters'),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  url: urlSchema,
  color: z.enum(COLORS, { 
    errorMap: () => ({ message: 'Please select a valid color' })
  }),
  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: 'Please select a valid category' })
  })
});

// Update block schema (all fields optional)
export const updateBlockSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(255, 'Title must be less than 255 characters')
    .optional(),
  description: z.string()
    .max(1000, 'Description must be less than 1000 characters')
    .optional(),
  url: urlSchema.optional(),
  color: z.enum(COLORS, { 
    errorMap: () => ({ message: 'Please select a valid color' })
  }).optional(),
  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: 'Please select a valid category' })
  }).optional()
});

// Query parameters schema
export const queryParamsSchema = z.object({
  category: z.enum(CATEGORIES).optional(),
  limit: z.string().transform(Number).pipe(z.number().min(1).max(100)).optional(),
  offset: z.string().transform(Number).pipe(z.number().min(0)).optional()
});

export type CreateBlockInput = z.infer<typeof createBlockSchema>;
export type UpdateBlockInput = z.infer<typeof updateBlockSchema>;
export type QueryParams = z.infer<typeof queryParamsSchema>;
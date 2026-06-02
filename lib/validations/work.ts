import { z } from 'zod';

export const workSchema = z.object({
  caption: z.string().min(1, 'Caption is required').max(200, 'Caption must be less than 200 characters'),
  image: z.string().url('Image must be a valid URL'),
  order: z.number().int().nonnegative('Order must be a non-negative number').optional(),
});

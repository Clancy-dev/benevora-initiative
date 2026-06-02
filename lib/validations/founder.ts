import { z } from 'zod';

export const founderSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  role: z.string().min(1, 'Role is required').max(150, 'Role must be less than 150 characters'),
  image: z.string().url('Invalid image URL'),
  bio: z.string().min(1, 'Bio is required').max(500, 'Bio must be less than 500 characters'),
  order: z.number().int().nonnegative('Order must be a non-negative number').optional(),
});

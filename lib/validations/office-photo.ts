import { z } from 'zod';

export const officePhotoSchema = z.object({
  image: z.string().url('Invalid image URL'),
  order: z.number().int().nonnegative('Order must be a non-negative number').default(0),
});

import { z } from 'zod';

export const emailSchema = z.object({
  email: z.string().email('Invalid email address'),
  order: z.number().int().nonnegative('Order must be a non-negative number').default(0),
});

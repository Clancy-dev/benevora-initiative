import { z } from 'zod';

export const phoneNumberSchema = z.object({
  phoneNumber: z.string().min(1, 'Phone number is required').max(20, 'Phone number must be less than 20 characters'),
  order: z.number().int().nonnegative('Order must be a non-negative number').default(0),
});

import { z } from 'zod';

export const mapSchema = z.object({
  embedUrl: z.string().refine((val) => val.includes('google.com/maps'), {
  message: 'Invalid Google Maps embed URL',
  }),
  order: z.number().int().nonnegative('Order must be a non-negative number').default(0),
});

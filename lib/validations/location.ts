import { z } from 'zod';

export const locationSchema = z.object({
  organizationName: z.string().min(1, 'Organization name is required').max(200, 'Organization name must be less than 200 characters'),
  addressLine1: z.string().min(1, 'Address line 1 is required').max(200, 'Address line 1 must be less than 200 characters'),
  addressLine2: z.string().min(1, 'Address line 2 is required').max(200, 'Address line 2 must be less than 200 characters'),
  postalCode: z.string().min(1, 'Postal code is required').max(50, 'Postal code must be less than 50 characters'),
  city: z.string().min(1, 'City is required').max(100, 'City must be less than 100 characters'),
  country: z.string().min(1, 'Country is required').max(100, 'Country must be less than 100 characters'),
  order: z.number().int().nonnegative('Order must be a non-negative number').default(0),
});

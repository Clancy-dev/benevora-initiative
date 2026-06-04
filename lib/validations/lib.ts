import { z } from 'zod';

export const eventFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  image: z.string().url('Must be a valid image URL'),
  date: z.string().min(1, 'Date is required'),
  order: z.number().int().min(0, 'Order must be non-negative'),
});

export type EventFormInput = z.infer<typeof eventFormSchema>;

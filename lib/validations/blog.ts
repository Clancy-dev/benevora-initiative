import { z } from 'zod';

const predefinedCategories = [
  'Education',
  'Impact',
  'Sustainability',
  'Empowerment',
  'Skills',
  'Community',
  'Innovation',
  'Compassion',
  'Excellence',
  'Integrity',
  'Other',
];

export const blogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  excerpt: z.string().min(1, 'Excerpt is required').max(500, 'Excerpt must be less than 500 characters'),
  content: z.string().min(1, 'Content is required').max(10000, 'Content must be less than 10000 characters'),
  image: z.string().url('Invalid image URL'),
  authorFirstName: z.string().min(1, 'First name is required').max(100, 'First name must be less than 100 characters'),
  authorLastName: z.string().min(1, 'Last name is required').max(100, 'Last name must be less than 100 characters'),
  author: z.string().optional().default(''), // Computed from firstName + lastName
  category: z.string().optional().default(''), // Category validation happens on submit
  slug: z.string().optional().default(''), // Slug is auto-generated, not user input
});

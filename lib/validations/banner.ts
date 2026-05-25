import { z } from "zod";

export const bannerFormSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  description: z.string().min(1, "Description is required").max(500, "Description must be less than 500 characters"),
  imageUrl: z.string().url("Image must be a valid URL").min(1, "Image is required"),
  order: z.number().optional(),

  
});

export type BannerFormInput = z.infer<typeof bannerFormSchema>;

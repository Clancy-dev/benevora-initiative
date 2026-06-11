import { z } from "zod";

export const instagramSchema = z.object({
  handle: z.string().min(1, "Instagram handle is required").regex(/^[a-zA-Z0-9._-]+$/, "Invalid Instagram handle format"),
  isActive: z.boolean().default(true),
});

export type InstagramInput = z.infer<typeof instagramSchema>;

import { z } from "zod";

export const facebookSchema = z.object({
  url: z.string().url("Invalid URL").refine(url => url.includes("facebook.com"), "URL must be a Facebook link"),
  isActive: z.boolean().default(true),
});

export type FacebookInput = z.infer<typeof facebookSchema>;

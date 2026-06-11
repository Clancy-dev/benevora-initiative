import { z } from "zod";

export const linkedinSchema = z.object({
  url: z.string().url("Invalid URL").refine(url => url.includes("linkedin.com"), "URL must be a LinkedIn link"),
  isActive: z.boolean().default(true),
});

export type LinkedinInput = z.infer<typeof linkedinSchema>;

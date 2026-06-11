import { z } from "zod";

export const xSchema = z.object({
  handle: z.string().min(1, "X handle is required").regex(/^[a-zA-Z0-9_]+$/, "Invalid X handle format"),
  isActive: z.boolean().default(true),
});

export type XInput = z.infer<typeof xSchema>;

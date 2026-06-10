import { z } from "zod";

export const whatsappSchema = z.object({
  phoneNumber: z.string().min(1, "Phone number is required").regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  isActive: z.boolean().default(true),
});

export type WhatsappInput = z.infer<typeof whatsappSchema>;

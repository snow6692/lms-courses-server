import { z } from "zod";

export const registrationSchema = z.object({
  name: z.string().min(2, "Name at least 2 chars"),
  email: z.email(),
  password: z.string().min(8, "Password at least 8 chars"),
  avatar: z.string().optional(),
});

export type RegistrationType = z.infer<typeof registrationSchema>;

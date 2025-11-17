import { z } from "zod";
const PASSWORD_REGEX =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{9,}$/;
export const registrationSchema = z.object({
  name: z.string().min(2, "Name at least 2 chars"),
  email: z.email(),
  password: z
    .string()
    .min(9, "Password at least 8 chars")
    .regex(PASSWORD_REGEX,"Password must contains numbers and one upper,lower char and a symbol"),
  avatar: z.string().optional(),
});

export type RegistrationType = z.infer<typeof registrationSchema>;

export const activateUserSchema = z.object({
  activation_code: z.string().min(2, "activation code is required"),
  activation_token: z.string().min(2, "activation token is required"),
});

import z from "zod";

export const registerUserValidator = z.object({
  name: z.string().nonempty(),
  email: z.email().nonempty(),
  password: z.string().min(5).max(30),
});

export const loginUserValidator = z.object({
  email: z.email().nonempty(),
  password: z.string().min(5).max(30),
});

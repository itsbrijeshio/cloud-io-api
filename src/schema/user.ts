import zod from "zod";

const name = zod
  .string({ error: "Name is required" })
  .min(3, { message: "Name should be at least 3 characters long" })
  .max(20, { message: "Name should be at most 20 characters long" });

const email = zod
  .string({ error: "Email is required" })
  .email({ message: "Invalid email address" });

const password = zod
  .string({ error: "Password is required" })
  .min(8, { message: "Password should be at least 8 characters long" })
  .max(30, { message: "Password should be at most 30 characters long" });

export const registerSchema = zod
  .object({
    name,
    email,
    password,
  })
  .strict();

export const loginSchema = zod
  .object({
    email,
    password,
  })
  .strict();

export const updateSchema = zod
  .object({
    name: name.optional(),
    email: email.optional(),
  })
  .strict();

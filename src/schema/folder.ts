import zod from "zod";

const name = zod
  .string({ error: "Name is required" })
  .min(1, { message: "Name should be at least 1 characters long" })
  .max(100, { message: "Name should be at most 100 characters long" });

const parent = zod.string({ error: "Parent is required" });

export const createSchema = zod
  .object({
    name,
    parent: parent.optional(),
  })
  .strict();

export const renameSchema = zod
  .object({
    name,
  })
  .strict();

export const moveSchema = zod
  .object({
    parent,
  })
  .strict();

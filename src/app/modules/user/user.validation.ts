import z from "zod";

export const updateUserSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name is too long")
    .optional(),
  age: z.number().min(18, "You must be at least 18 years old").optional(),
});

export type UpdateUser = z.infer<typeof updateUserSchema>;

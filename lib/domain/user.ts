import { z } from "zod";

export type User = {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

export const UserSchema = z.object({
  id: z.coerce.number().gt(0, "ID must be greater than 0"),
  name: z.string({required_error: "User name is a required field"}).min(2, "Name should be at least 2 characters long"),
  email: z.string({required_error: "Email is a required field"}).email("Invalid email format"),
  createdAt: z.coerce.date(),
});

export const CreateUserSchema = UserSchema.omit({id: true})
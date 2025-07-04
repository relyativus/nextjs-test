"use server";

import { revalidatePath } from "next/cache";
import { CreateUserSchema, User, UserSchema } from "./user";
import { ValidationState } from "./validation.state";
import { executeQuery, insertBulk } from "../infra/db/query.executor";
import { ZodError } from "zod";
import { RowDataPacket } from "mysql2";

/**
 * Retrieves a list of all users from the database.
 *
 * @returns list of users
 */
export async function getUsers(): Promise<User[]> {
  const results = await executeQuery("SELECT * FROM users", []);
  return results.map((row) => mapUserFromDbResult(row));
}

function mapUserFromDbResult(row: RowDataPacket): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    createdAt: new Date(row.created_at),
  };
}

/**
 *
 * Handles the creation of a new user in the system. Initially, it validates the user data submitted from the form against the `CreateUserSchema`.
 * Then it inserts the validated user data into the database. Finally, it revalidates the path to ensure that the latest data is reflected in users screen.
 *
 * @param userForm user fields submitted from the form, including name, email, and createdAt
 * @returns
 */
export async function createUser(
  userForm: FormData
): Promise<void | ValidationState> {
  const userFields = extractFormDataValues(userForm);
  const validationResult = await CreateUserSchema.refine(
    async (data) => validateEmailUniqueness(data.email),
    { message: "Email already exists", path: ["email"] }
  ).safeParseAsync(userFields);

  if (!validationResult.success) {
    return createValidationState(validationResult.error);
  }
  await createUserInDatabase(validationResult.data);
  revalidatePath("/");
}

export async function createUsersBulk(users: User[]) {
  await insertBulk(
    "users",
    ["id", "name", "email", "created_at"],
    users.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      created_at: user.createdAt,
    }))
  );
}

export async function deleteAll() {
  await executeQuery("TRUNCATE users", {});
  revalidatePath("/");
}

export async function getUserById(id: number) {
  return executeQuery("SELECT * FROM users where id=:id", { id }).then((rows) =>
    mapUserFromDbResult(rows[0])
  );
}

export async function updateUser(
  updatedFields: FormData
): Promise<void | ValidationState> {
  const updates = extractFormDataValues(updatedFields);
  const validationResult = await UserSchema.refine(
    async (data) => validateEmailUniqueness(data.email, data.id),
    { message: "Email already exists", path: ["email"] }
  ).safeParseAsync(updates);
  if (!validationResult.success) {
    return createValidationState(validationResult.error);
  }

  await updateUserInDatabase(validationResult.data);
  revalidatePath("/");
}

export async function deleteUser(id: number): Promise<void> {
  await executeQuery("DELETE FROM users WHERE id = :id", { id });
  revalidatePath("/");
}

async function validateEmailUniqueness(
  email: string,
  id?: number
): Promise<boolean> {
  const query = id
    ? "SELECT coalesce(COUNT(1),0) as count FROM users WHERE email = :email AND id <> :id"
    : "SELECT coalesce(COUNT(1),0) as count FROM users WHERE email = :email";
  const params = id ? { email, id } : { email };
  const result = await executeQuery(query, params);
  return result[0].count === 0;
}

async function updateUserInDatabase(user: User): Promise<void> {
  await executeQuery(
    "UPDATE users SET name = :name, email = :email, created_at = :createdAt WHERE id = :id",
    user
  );
}

async function createUserInDatabase(user: UserFields): Promise<void> {
  await executeQuery(
    "INSERT INTO users (name, email, created_at) VALUES (:name, :email, :createdAt)",
    user
  );
}

function createValidationState(error: ZodError): ValidationState {
  return {
    success: false,
    message:
      "Failed to create a user due to constraint violations. Please review the errors ",
    errors: error.flatten().fieldErrors,
  };
}

function extractFormDataValues(userForm: FormData) {
  return {
    id: userForm.get("id") as string,
    name: userForm.get("name") as string,
    email: userForm.get("email") as string,
    createdAt: userForm.get("createdAt") as string,
  };
}

type UserFields = {
  name: string;
  email: string;
  createdAt: Date | string;
};

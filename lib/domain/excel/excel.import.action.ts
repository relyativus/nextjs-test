"use server";
import * as XLSX from "xlsx";
import { UserSchema } from "../user";
import { createUsersBulk, fetchAllUniqueUserProperties } from "../users.action";
import { ExcelUser } from "./excel.user";

/**
 * Parse user excel format and apply the validation rules to extracted items.
 * This handler is used to generate preview of the users that can be imported
 * 
 * @param file excel file
 * @returns list of users with violations attached if any
 */
export async function convertExcelToUsers(
  file: ArrayBuffer
): Promise<ExcelUser[]> {
  const usersWorkbook = XLSX.read(file);
  const firstSheetName = usersWorkbook.SheetNames[0];
  const sheet = usersWorkbook.Sheets[firstSheetName];
  {/* eslint-disable  @typescript-eslint/no-explicit-any */}
  const data = XLSX.utils.sheet_to_json<Record<string, any>>(sheet);

  const users = data.map((user) => ({
    id: user["ID"] as number,
    name: user["Name"],
    email: user["Email"],
    createdAt: user["Created At"] ? user["Created At"] : null,
  }));

  const uniquenessValidationCtx = await prepareUniquenessValidationContext(
    users
  );
  return users.map((user) => validateUser(user, uniquenessValidationCtx));
}

async function prepareUniquenessValidationContext(
  users: { id: number; name: string; email: string; createdAt: string }[]
): Promise<UniquenessValidationCtx> {
  const existingUsers = await fetchAllUniqueUserProperties();
  const allEmails = existingUsers
    .map((user) => user.email)
    .concat(users.map((user) => user.email).filter((email) => email));
  const allIds = existingUsers
    .map((user) => user.id.toString())
    .concat(users.map((user) => user.id?.toString()).filter((id) => id));
  return {
    emails: aggregateOccurences(allEmails),
    ids: aggregateOccurences(allIds),
  };
}

function aggregateOccurences(items: string[]): Map<string, number> {
  const result = new Map<string, number>();

  for (const item of items) {
    result.set(item, (result.get(item) ?? 0) + 1);
  }

  return result;
}



/**
 * Imports users extracted from excel into the database
 * 
 * @param file excel file∏
 */
export async function importData(file: ArrayBuffer): Promise<void> {
  const excelUsers = await convertExcelToUsers(file);
  const users = excelUsers
    .filter((user) => !user.errors)
    .map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    }));
  if (users.length > 0) {
    await createUsersBulk(users);
  }
}

function validateUser(
/* eslint-disable  @typescript-eslint/no-explicit-any */
  user: Record<string, any>, 
  ctx: UniquenessValidationCtx
): ExcelUser {
  const comprehensiveSchema = UserSchema.refine(
    (userData) =>
      !userData.id || (ctx.ids.get(userData.id.toString()) || 0) < 2,
    (userData) => ({
      message: `User with id ${userData.id} already exists`,
      path: ["id"],
    })
  ).refine(
    (userData) => !userData.email || (ctx.emails.get(userData.email) || 0) < 2,
    (userData) => ({
      message: `User with email ${userData.email} already exists`,
      path: ["email"],
    })
  );
  const validationResult = comprehensiveSchema.safeParse(user);
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
    errors: validationResult.error?.flatten().fieldErrors,
  };
}

type UniquenessValidationCtx = {
  emails: Map<string, number>;
  ids: Map<string, number>;
};

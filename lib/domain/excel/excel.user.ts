import { UserFieldErrors } from "../validation.state";

export type ExcelUser = {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
    errors?:UserFieldErrors;
}
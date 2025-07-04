export type ValidationState = {
  success: boolean;
  message: string;
  errors: UserFieldErrors;
};

export type UserFieldErrors = {
  id?: string[] | undefined;
  name?: string[] | undefined;
  email?: string[] | undefined;
  createdAt?: string[] | undefined;
};

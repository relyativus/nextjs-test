"use client";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input";
import React from "react";
import { ValidationErrorLabel } from "../ui/ValidationErrorLabel";
import { DatePicker } from "../ui/datepicker";

export default function UserFields({
  user,
  validationResult,
}: {
  user?: { name?: string; email?: string; createdAt?: string | Date } | void;
  validationResult?: {
    errors: { email?: string[]; name?: string[]; createdAt?: string[] };
  };
}) {
  return (
    <div className="grid gap-4">
      <div className="grid gap-3">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" defaultValue={user?.name} />
        <ValidationErrorLabel errors={validationResult?.errors?.name} />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" defaultValue={user?.email} />
        <ValidationErrorLabel errors={validationResult?.errors?.email} />
      </div>
      <div className="grid gap-3">
        <div className="flex flex-col gap-3">
          <DatePicker
            defaultValue={user?.createdAt ? new Date(user.createdAt) : undefined}
            formValueName="createdAt"
            label="Created At"
            errorMessages={validationResult?.errors?.createdAt}
          />
        </div>
      </div>
    </div>
  );
}

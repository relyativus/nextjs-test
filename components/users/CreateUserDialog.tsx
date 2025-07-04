"use client";
import {
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Dialog, DialogHeader } from "../ui/dialog";
import UserFields from "./UserFields";
import { createUser } from "@/lib/domain/users.action";
import { useActionState, useState } from "react";
import { toast } from "sonner";

export default function CreateUserDialog() {
  const validationState = {
    user: {},
    executionResult: {
      success: true,
      message: "",
      errors: {},
    },
  };

  {/* eslint-disable  @typescript-eslint/no-explicit-any */}
  const wrappedAction = async (_prevState: any, formData: FormData) => {
    const result = await createUser(formData);
    if (!result?.errors) {
      setOpen(false);
      toast.success(`User ${formData.get("name")} created successfully`, {
        duration: 3000,
      });
      return { user: {}, executionResult: { success: true, errors: {} } };
    } else {
      return {
        user: {
          name: formData.get("name") as string,
          email: formData.get("email") as string,
          createdAt: formData.get("createdAt") as string,
        },
        executionResult: result,
      };
    }
  };
  const [state, submitAction, isPending] = useActionState(
    wrappedAction,
    validationState
  );
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create New</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={submitAction}>
          <DialogHeader>
            <DialogTitle>Create user</DialogTitle>
            <DialogDescription>
              Registers new user in the system
            </DialogDescription>
          </DialogHeader>
          <UserFields
            key={"create"}
            user={state.user}
            validationResult={state.executionResult}
          />
          <DialogFooter className="gap-2 mt-10">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

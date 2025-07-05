"use client";
import { User } from "@/lib/domain/user";
import { getUserById, updateUser } from "@/lib/domain/users.action";
import { ValidationState } from "@/lib/domain/validation.state";
import {
  DialogClose,
  DialogDescription,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { EditIcon } from "lucide-react";
import { useActionState, useState } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import UserFields from "./UserFields";

export function UpdateUserDialog({ id, onCompletion }: { id: number, onCompletion: () => void }) {
  const validationState: ValidationState = {
    success: true,
    message: "",
    errors: {},
  };
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState<User>();
  {/* eslint-disable  @typescript-eslint/no-explicit-any */}
  const wrappedAction = async (_prevState: any, formData: FormData) => {
    const result = await updateUser(formData);
    if (!result?.errors) {
      setOpen(false);
      setUser(undefined);
      toast.success(`User ${formData.get("name")} updated successfully`, {
        duration: 3000,
      });
      onCompletion()
      return { success: true, errors: {} };
    }
    return result;
  };
  const [actionResult, submitAction, isPending] = useActionState(
    wrappedAction,
    validationState
  );
  const handleOpen = async (open: boolean) => {
    setOpen(open);
    if (open) {
      setUser(await getUserById(id))
    }  else {
      setUser(undefined);
    }
  };
  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant={"secondary"}>
          <EditIcon />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form action={submitAction}>
          <Input type="hidden" name="id" value={id} />
          <DialogHeader>
            <DialogTitle>Update user</DialogTitle>
            <DialogDescription>
              Updates personal details for specific user
            </DialogDescription>
          </DialogHeader>
          <UserFields user={user} validationResult={actionResult} />
          <DialogFooter className="gap-2 mt-10">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={!user || isPending}>
              Save changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

'use client'
import { TrashIcon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { useState } from "react";
import { deleteAll } from "@/lib/domain/users.action";
import { toast } from "sonner";


export function DeleteAll() {

    const [open, setOpen] = useState(false)
    const handleDelete = async () => {
        await deleteAll()
        setOpen(false)
        toast.success("All users removed successfully", {duration: 3000})
    }

    return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
         <Button variant={"destructive"} >
          <TrashIcon  /> Delete all
          </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete all the users.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel asChild><Button variant={"secondary"}>Cancel</Button></AlertDialogCancel>
          <AlertDialogAction asChild><Button onClick={handleDelete} variant={"destructive"}>Confirm</Button></AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
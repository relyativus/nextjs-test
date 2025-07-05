'use client'
import { Button } from "@/components/ui/button";
import CreateUserDialog from "@/components/users/CreateUserDialog";
import UserDialog from "@/components/users/CreateUserDialog";
import { DeleteAll } from "@/components/users/DeleteAll";

import UsersTable from "@/components/users/UsersTable";
import { User } from "@/lib/domain/user";
import { getUsers } from "@/lib/domain/users.action";
import { UploadIcon } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [users, setUsers] = useState<User[]>();
  const [refresh, setRefresh] = useState(true);
  useEffect(() => {
      getUsers().then((users) => setUsers(users));
  }, [refresh]);
  const triggerRefresh = () => setRefresh(!refresh)
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-end w-full">
        <CreateUserDialog onCompletion={triggerRefresh} />
        <Button variant="secondary" asChild>
          <Link href="/excel">
            <UploadIcon />
            Upload XLSX
          </Link>
        </Button>
        <DeleteAll onCompletion={triggerRefresh}/>
      </div>
      <div className="mt-10 w-full max-h-[500] overflow-y-scroll">
        <UsersTable users={users} onCompletion={triggerRefresh}/>
      </div>
    </>
  );
}

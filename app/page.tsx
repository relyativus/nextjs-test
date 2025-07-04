import { Button } from "@/components/ui/button";
import UserDialog from "@/components/users/CreateUserDialog";
import { DeleteAll } from "@/components/users/DeleteAll";

import UsersTable from "@/components/users/UsersTable";
import { UploadIcon } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-end w-full">
        <UserDialog />
        <Button variant="secondary" asChild>
          <Link href="/excel">
            <UploadIcon />
            Upload XLSX
          </Link>
        </Button>
        <DeleteAll />
      </div>
      <div className="mt-10 w-full max-h-[500] overflow-y-scroll">
        <UsersTable />
      </div>
      
    </>
    
  );
}

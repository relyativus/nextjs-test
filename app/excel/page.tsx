"use client";
import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from "@/components/ui/shadcn-io/dropzone";
import { useState } from "react";
import { toast } from "sonner";
import ExcelPreview from "./excel.preview";
import { ExcelUser } from "@/lib/domain/excel/excel.user";
import { Button } from "@/components/ui/button";
import {
  convertExcelToUsers,
  importData,
} from "@/lib/domain/excel/excel.import.action";
import { redirect } from "next/navigation";

export default function ExcelPage() {
  const [files, setFiles] = useState<File[] | undefined>([]);
  const [users, setUsers] = useState<ExcelUser[]>([]);
  const [disabled, setDisabled] = useState(true);

  const handleDrop = async (files: File[]) => {
    setFiles(files);
    if (files) {
      const fileBuffer = await files[0].arrayBuffer();
      const extractedUsers = await convertExcelToUsers(fileBuffer)
      setUsers(extractedUsers);
      const invalidUsers = extractedUsers.filter(user => Object.keys(user.errors || {}).length > 0)
      setDisabled(invalidUsers.length === extractedUsers.length);
    }
  };

  const handleError = (error: Error) => {
    toast.error(`Error: ${error.message}`, { duration: 3000 });
  };

  const loadData = async () => {
    if (files) {
      const fileBuffer = await files[0].arrayBuffer();
      await importData(fileBuffer)
      setUsers([]);
      toast.success("Excel import completed successfully", {duration: 3000})
      redirect("/")
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full items-center justify-items-center">
      <div className="flex flex-rows gap-4 justify-between w-2xl">
        <h1 className="text-2xl font-bold mb-4 ">Upload users bulk</h1>
        <Button disabled={disabled} onClick={loadData}>Upload</Button>
      </div>
      <div className="grid grid-rows gap-4 w-2xl">
        <Dropzone
          maxSize={1024 * 1024 * 50} // 50 MB
          maxFiles={1}
          accept={{ "application/vnd.ms-excel": [], "application/msexcel":[], "application/x-msexcel":[], "application/x-ms-excel":[], "application/x-excel":[], "application/xls":[], "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":[] }}
          onDrop={handleDrop}
          src={files}
          onError={handleError}
        >
          <DropzoneEmptyState />
          <DropzoneContent />
        </Dropzone>
        {(files?.length || 0) > 0 && <ExcelPreview users={users} />}
      </div>
    </div>
  );
}

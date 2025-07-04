import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCaption, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import { ExcelUser } from "@/lib/domain/excel/excel.user";
import { ViolationTooltip } from "./violationTooltip";

export default function ExcelPreview({users}: {users: ExcelUser[]}) {
  return (
    <div className="max-h-[200] overflow-y-scroll">
     <Table>
          <TableCaption>Preview</TableCaption>
          <TableHeader>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Created At</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users?.map((user, index) => (
              <TableRow key={index} className={user.errors ? "red": "green"}>
                <TableCell><ViolationTooltip content={user?.id?.toString()} errors={user.errors?.id}></ViolationTooltip></TableCell>
                <TableCell><ViolationTooltip content={user?.name?.toString()} errors={user.errors?.name}></ViolationTooltip></TableCell>
                <TableCell><ViolationTooltip content={user?.email?.toString()} errors={user.errors?.email}></ViolationTooltip></TableCell>
                <TableCell><ViolationTooltip content={user?.createdAt?.toString()} errors={user.errors?.createdAt}></ViolationTooltip></TableCell>
                <TableCell><Badge variant={user.errors ? "destructive" : "secondary"} className={user.errors ? "" : "bg-green-500"}>{ user.errors ? "Invalid": "Passed" }</Badge></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </div>
  );
}
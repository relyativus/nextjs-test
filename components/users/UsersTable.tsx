'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { User } from "@/lib/domain/user";
import { formatDate } from "@/lib/utils";
import { DeleteUser } from "./DeleteUser";
import { UpdateUserDialog } from "./UpdateUserDialog";

export default function UsersTable({users, onCompletion}: {users: User[] | undefined, onCompletion: () => void }) {

  return (
    
      <Table>
        <TableHeader>
          <TableRow>
            <TableCell>Id</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Created At</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="flex items-center gap-2">
                {user.id}
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{formatDate(user.createdAt)}</TableCell>
              <TableCell className="text-right">
                <div className="pd-2 flex items-center justify-end gap-2">
                  <UpdateUserDialog key={`update_${user.id}`} id={user.id} onCompletion={onCompletion} />
                  <DeleteUser key={`delete_${user.id}`} id={user.id} onCompletion={onCompletion} />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    
  );
}

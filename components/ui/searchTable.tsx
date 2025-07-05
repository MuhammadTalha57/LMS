"use client";

import { toast } from "sonner";
import Search from "@/components/ui/search";
import { PopupForm } from "@/components/ui/popupForm";
import { Button } from "@/components/ui/button";
import { addTeacherFormFields } from "@/lib/actions/definitions";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type entity = {
  id: string;
  name: string;
};

export default function SearchTable({
  categories,
  searchQuery,
  modifiable,
  addQuery,
}: // editQuery,
// deleteQuery,
{
  categories: string[];
  searchQuery: (searchData: Record<string, string>) => Promise<any>;
  modifiable: boolean;
  addQuery: (userData: Record<string, any>) => Promise<any>;
  // editQuery: (id: { id: string }) => Promise<any>;
  // deleteQuery: (id: { id: string }) => Promise<any>;
}) {
  const [result, setResult] = useState<entity[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSearch = async (searchData: Record<string, string>) => {
    const data = await searchQuery(searchData);
    setResult(data);
  };

  const handleAdd = async (userData: Record<string, any>) => {
    try {
      await addQuery(userData);
      toast("Added Successfully");
    } catch (error) {
      toast.error("Add Operation Failed");
    }
  };

  return (
    <div className="flex flex-col items-center ">
      {modifiable ? (
        <div>
          <Button onClick={() => setDialogOpen(true)}>Add</Button>
          <PopupForm
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={handleAdd}
            title=""
            description="Fill in the details below."
            submitButtonText="Add"
            fields={addTeacherFormFields}
          />
        </div>
      ) : null}
      <Search categories={categories} handleSearch={handleSearch}></Search>
      <Table>
        <TableCaption>Teachers</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    // <Dashboard
    //   userRole={role}
    //   userName={name}
    //   handleSignOut={signout}
    //   backBtnHidden={false}
    //   children={
    //   }
    // ></Dashboard>
  );
}

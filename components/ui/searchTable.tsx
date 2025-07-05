// "use client";

// import { toast } from "sonner";
// import Search from "@/components/ui/search";
// import { PopupForm } from "@/components/ui/popupForm";
// import { Button } from "@/components/ui/button";
// import { addTeacherFormFields } from "@/lib/actions/definitions";
// import { IconPlus } from "@tabler/icons-react";
// import {Label} from "@/components/ui/label";
// import { useState } from "react";
// import {
//   Table,
//   TableBody,
//   TableCaption,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";

// type entity = {
//   id: string;
//   name: string;
// };

// export default function SearchTable({
//   categories,
//   searchQuery,
//   modifiable,
//   addQuery,
//   descQuery,
// }: // editQuery,
// // deleteQuery,
// {
//   categories: string[];
//   searchQuery: (searchData: Record<string, string>) => Promise<any>;
//   modifiable: boolean;
//   addQuery: (userData: Record<string, any>) => Promise<any>;
//   descQuery: (userData: Record<string, string>) => Promise<any>;
//   // editQuery: (id: { id: string }) => Promise<any>;
//   // deleteQuery: (id: { id: string }) => Promise<any>;
// }) {
//   const [result, setResult] = useState<entity[]>([]);
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [descDialogOpen, setDescDialogOpen] = useState(false);
//   const [descDialogData, setDescDialogData] = useState();

//   const handleSearch = async (searchData: Record<string, string>) => {
//     const data = await searchQuery(searchData);
//     setResult(data);
//   };

//   const handleAdd = async (userData: Record<string, any>) => {
//     try {
//       await addQuery(userData);
//       toast.success("Added Successfully");
//     } catch (error) {
//       toast.error("Add Operation Failed");
//     }
//   };

//   const handleRowClick = async (index: number) => {
//     try {
//       setDescDialogOpen(true);
//       const data = await descQuery(result[index]);
//       setDescDialogData(data[0]);
//     } catch (error) {
//       toast.error("An Error Occured");
//     }
//   };

//   return (
//     <div className="flex flex-col items-center ">
//       {modifiable ? (
//         <div>
//           <Button onClick={() => setDialogOpen(true)}>Add</Button>
//           <PopupForm
//             open={dialogOpen}
//             onOpenChange={setDialogOpen}
//             onSubmit={handleAdd}
//             title=""
//             description="Fill in the details below."
//             submitButtonText="Add"
//             fields={addTeacherFormFields}
//           />
//         </div>
//       ) : null}
//       {descDialogOpen ? (
//         <Dialog>
//           <DialogContent className="sm:max-w-[425px]">
//             <div>
//               {descDialogData &&
//                 Object.entries(descDialogData).map(([key, value]) => (
//                   <div>
//                     <Label></Label>
//                   </div>
//                 ))}
//             </div>
//           </DialogContent>
//         </Dialog>
//       ) : null}

//       <Search categories={categories} handleSearch={handleSearch}></Search>
//       <Table>
//         <TableCaption>Teachers</TableCaption>
//         <TableHeader>
//           <TableRow>
//             <TableHead className="w-[100px]">ID</TableHead>
//             <TableHead>Name</TableHead>
//           </TableRow>
//         </TableHeader>
//         <TableBody>
//           {result.map((row, index) => (
//             <TableRow key={row.id} onClick={() => handleRowClick(index)}>
//               <TableCell className="font-medium">{row.id}</TableCell>
//               <TableCell>{row.name}</TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </div>
//     // <Dashboard
//     //   userRole={role}
//     //   userName={name}
//     //   handleSignOut={signout}
//     //   backBtnHidden={false}
//     //   children={
//     //   }
//     // ></Dashboard>
//   );
// }

"use client";
import { toast } from "sonner";
import Search from "@/components/ui/search";
import { PopupForm } from "@/components/ui/popupForm";
import { Button } from "@/components/ui/button";
import { IconPlus } from "@tabler/icons-react";
import { Label } from "@/components/ui/label";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { type FieldConfig } from "@/components/ui/popupForm";

type entity = {
  id: string;
  name: string;
};

// Helper function to format field names
function formatFieldName(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .replace(/^./, (str) => str.toUpperCase()) // Capitalize first letter
    .replace(/_/g, " "); // Replace underscores with spaces
}

// Helper function to format field values
function formatFieldValue(key: string, value: any): string {
  if (value === null || value === undefined) {
    return "Not specified";
  }

  // Format specific fields
  switch (key.toLowerCase()) {
    case "salary":
      return typeof value === "number"
        ? `$${value.toLocaleString()}`
        : value.toString();
    case "gender":
      return (
        value.toString().charAt(0).toUpperCase() + value.toString().slice(1)
      );
    case "id":
      return value.toString();
    default:
      return value.toString();
  }
}

export default function SearchTable({
  categories,
  searchQuery,
  modifiable,
  addQuery,
  descQuery,
  formFields,
}: {
  categories: string[];
  searchQuery: (searchData: Record<string, string>) => Promise<any>;
  modifiable: boolean;
  addQuery: (userData: Record<string, any>) => Promise<any>;
  descQuery: (id: string) => Promise<any>;
  formFields: FieldConfig[];
}) {
  const [result, setResult] = useState<entity[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [descDialogOpen, setDescDialogOpen] = useState(false);
  const [descDialogData, setDescDialogData] = useState<Record<
    string,
    any
  > | null>(null);
  const [selectedRowName, setSelectedRowName] = useState<string>("");

  const handleSearch = async (searchData: Record<string, string>) => {
    const data = await searchQuery(searchData);
    setResult(data);
  };

  const handleAdd = async (userData: Record<string, any>) => {
    try {
      await addQuery(userData);
      toast.success("Added Successfully");
    } catch (error) {
      toast.error("Add Operation Failed");
    }
  };

  const handleRowClick = async (index: number) => {
    try {
      setDescDialogOpen(true);
      setSelectedRowName(result[index].name);
      const data = await descQuery(result[index].id);
      setDescDialogData(data[0]);
    } catch (error) {
      toast.error("An Error Occurred");
      setDescDialogOpen(false);
    }
  };

  const handleCloseDescDialog = () => {
    setDescDialogOpen(false);
    setDescDialogData(null);
    setSelectedRowName("");
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {modifiable && (
        <div className="w-full flex flex-col items-center justify-center">
          <Button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2"
          >
            <IconPlus className="w-4 h-4" />
            Add
          </Button>
          <PopupForm
            open={dialogOpen}
            onOpenChange={setDialogOpen}
            onSubmit={handleAdd}
            title="Add"
            description="Fill in the details below."
            submitButtonText="Add"
            fields={formFields}
          />
        </div>
      )}

      {/* Details Dialog */}
      <Dialog open={descDialogOpen} onOpenChange={handleCloseDescDialog}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <DialogTitle></DialogTitle>
          <div className="space-y-4">
            {descDialogData ? (
              <>
                {Object.entries(descDialogData).map(([key, value], index) => (
                  <div key={key}>
                    <div className="flex flex-col space-y-1">
                      <Label className="text-sm font-semibold text-gray-700">
                        {formatFieldName(key)}
                      </Label>
                      <div className="text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                        {formatFieldValue(key, value)}
                      </div>
                    </div>
                    {index < Object.entries(descDialogData).length - 1 && (
                      <Separator className="mt-3" />
                    )}
                  </div>
                ))}
              </>
            ) : (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Loading details...</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={handleCloseDescDialog}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Search categories={categories} handleSearch={handleSearch} />

      <Table className="cursor-pointer">
        <TableCaption>
          Click on any row to view detailed information
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {result.map((row, index) => (
            <TableRow
              key={row.id}
              onClick={() => handleRowClick(index)}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <TableCell className="font-medium">{row.id}</TableCell>
              <TableCell>{row.name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

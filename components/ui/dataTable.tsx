"use client";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataColumn, FieldConfig } from "@/lib/actions/definitions";
import NonEditableDialog from "./ nonEditableDialog";
import { useState } from "react";
import { toast } from "sonner";
import { IconEdit, IconTrashXFilled } from "@tabler/icons-react";
import UsePopupForm from "./usePopupForm";

export default function DataTable({
  tableCaption,
  tableCols,
  modifiable,
  result,
  descDialogTitle,
  descDialogDescription,
  descQuery,
  editFormDescription,
  editFormTitle,
  editFormSubmitBtnText,
  editFormFields,
  onEdit,
}: {
  tableCaption: string;
  tableCols: DataColumn[];
  modifiable: boolean;
  result: any;
  descDialogTitle: string;
  descDialogDescription: string;
  descQuery: (rowData: any) => Promise<any>;
  editFormDescription: string;
  editFormTitle: string;
  editFormSubmitBtnText: string;
  editFormFields: FieldConfig[];
  onEdit: (data: Record<string, any>) => Promise<any>;
}) {
  const [descDialogOpen, setDescDialogOpen] = useState(false);
  const [descDialogData, setDescDialogData] = useState<Record<
    string,
    any
  > | null>(null);

  const handleRowClick = async (index: number) => {
    try {
      setDescDialogOpen(true);
      //setSelectedRowName(result[index].name);
      const data = await descQuery(result[index]);
      setDescDialogData(data[0]);
    } catch (error) {
      toast.error("An Error Occured");
      setDescDialogOpen(false);
    }
  };

  const handleDialogClose = () => {
    setDescDialogOpen(false);
    setDescDialogData(null);
    //setSelectedRowName("");
  };

  return (
    <div>
      <NonEditableDialog
        title={descDialogTitle}
        description={descDialogDescription}
        dialogOpen={descDialogOpen}
        handleDialogClose={handleDialogClose}
        dialogData={descDialogData}
      ></NonEditableDialog>

      <Table className="cursor-pointer">
        <TableCaption>{tableCaption}</TableCaption>
        <TableHeader>
          <TableRow>
            {tableCols.map((col, idx) => (
              <TableHead key={idx} className={col.className}>
                {col.header}
              </TableHead>
            ))}
            {modifiable && <TableHead>Edit</TableHead>}
            {modifiable && <TableHead>Delete</TableHead>}
          </TableRow>
        </TableHeader>

        <TableBody>
          {result.map((row: any, index: any) => (
            <TableRow
              key={index}
              onClick={() => handleRowClick(index)}
              className="hover:bg-gray-50 cursor-pointer transition-colors"
            >
              {tableCols.map((col, idx) => (
                <TableCell key={tableCols.length * index + idx}>
                  {row[col.accessor]}
                </TableCell>
              ))}

              {/* Edit And Delete Buttons */}
              {modifiable && (
                <TableCell>
                  <UsePopupForm
                    btnText=""
                    BtnIcon={IconEdit}
                    formTitle={editFormTitle}
                    formDescription={editFormDescription}
                    formSubmitBtnText={editFormSubmitBtnText}
                    formFields={editFormFields}
                    onSubmit={onEdit}
                    defaultValues={row}
                  ></UsePopupForm>
                </TableCell>
              )}
              {modifiable && (
                <TableCell>
                  <IconTrashXFilled></IconTrashXFilled>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

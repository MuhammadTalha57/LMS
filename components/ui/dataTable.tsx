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
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { AlertDialogFooter, AlertDialogHeader } from "./alert-dialog";

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
  delQuery,
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
  delQuery: (rowData: any) => Promise<any>;
}) {
  const [descDialogOpen, setDescDialogOpen] = useState(false);
  const [descDialogData, setDescDialogData] = useState<Record<
    string,
    any
  > | null>(null);

  const [delAlertOpen, setDelAlertOpen] = useState(false);
  const [delRow, setDelRow] = useState<Record<string, any> | null>(null);

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

  const handleDelete = async () => {
    if (delRow) {
      try {
        delQuery(delRow);
        toast.success("Deleted Successfully");
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        } else {
          toast.error("Delete Operation Failed due to unknown error");
        }
      }
    }

    setDelRow(null);
  };

  return (
    <div>
      <AlertDialog open={delAlertOpen}>
        <AlertDialogTrigger></AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action can't be undone
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setDelAlertOpen(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDelete();
                setDelAlertOpen(false);
              }}
            >
              Yes
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
                <TableCell
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <IconTrashXFilled
                    onClick={() => {
                      setDelAlertOpen(true);
                      setDelRow(row);
                    }}
                  ></IconTrashXFilled>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

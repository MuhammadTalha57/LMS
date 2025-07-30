"use client";
import Search from "@/components/ui/search";
import { useState } from "react";
import DataTable from "./dataTable";
import { DataColumn } from "@/lib/actions/definitions";
import { FieldConfig } from "@/lib/actions/definitions";

export default function SearchTable({
  categories,
  searchQuery,
  modifiable,
  tableCaption,
  tableCols,
  descDialogTitle,
  descDialogDescription,
  descQuery,
  editFormDescription,
  editFormTitle,
  editFormSubmitBtnText,
  editFormFields,
  onEdit,
}: {
  categories: string[];
  searchQuery: (searchData: Record<string, string>) => Promise<any>;
  modifiable: boolean;
  tableCaption: string;
  tableCols: DataColumn[];
  descDialogTitle: string;
  descDialogDescription: string;
  descQuery: (rowData: any) => Promise<any>;
  editFormDescription: string;
  editFormTitle: string;
  editFormSubmitBtnText: string;
  editFormFields: FieldConfig[];
  onEdit: (data: Record<string, any>) => Promise<any>;
}) {
  const [result, setResult] = useState<any>([]);

  const handleSearch = async (searchData: Record<string, string>) => {
    const data = await searchQuery(searchData);
    setResult(data);
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      <Search categories={categories} handleSearch={handleSearch} />

      <DataTable
        tableCaption={tableCaption}
        tableCols={tableCols}
        descQuery={descQuery}
        descDialogDescription={descDialogDescription}
        descDialogTitle={descDialogTitle}
        modifiable={modifiable}
        result={result}
        editFormDescription={editFormDescription}
        editFormFields={editFormFields}
        editFormSubmitBtnText={editFormSubmitBtnText}
        editFormTitle={editFormTitle}
        onEdit={onEdit}
      ></DataTable>
    </div>
  );
}

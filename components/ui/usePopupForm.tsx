"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import { PopupForm } from "@/components/ui/popupForm";
import { FieldConfig } from "@/lib/actions/definitions";

export default function UsePopupForm({
  btnText,
  BtnIcon,
  formTitle,
  formDescription,
  formSubmitBtnText,
  formFields,
  defaultValues = {},
  onSubmit,
}: {
  btnText: string;
  BtnIcon: React.ElementType;
  formTitle: string;
  formDescription: string;
  formSubmitBtnText: string;
  formFields: FieldConfig[];
  defaultValues?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => Promise<void>;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <Button
        onClick={(e) => {
          e.stopPropagation();
          setDialogOpen(true);
        }}
        className="flex items-center gap-2"
      >
        <BtnIcon className="w-4 h-4" />
        {btnText}
      </Button>
      <PopupForm
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={onSubmit}
        title={formTitle}
        description={formDescription}
        submitButtonText={formSubmitBtnText}
        fields={formFields}
        defaultValues={defaultValues}
      />
    </div>
  );
}

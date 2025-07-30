"use client";

import UsePopupForm from "./usePopupForm";
import { IconPlus } from "@tabler/icons-react";
import { addTeacherFormFields } from "@/lib/actions/definitions";
import { toast } from "sonner";
import { addTeacher } from "@/lib/actions/queries";

export default function AddTeacherForm() {
  const handleAdd = async (userData: Record<string, any>) => {
    try {
      await addTeacher(userData);
      toast.success("Added Successfully");
    } catch (error) {
      toast.error("Add Operation Failed");
    }
  };

  return (
    <UsePopupForm
      btnText="Add Teacher"
      BtnIcon={IconPlus}
      formTitle="Add Teacher"
      formDescription="Fill in the details to add new Teacher"
      formSubmitBtnText="Add Teacher"
      formFields={addTeacherFormFields}
      onSubmit={handleAdd}
    ></UsePopupForm>
  );
}

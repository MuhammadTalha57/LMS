import { type FieldConfig } from "@/components/ui/popupForm";

export type User = {
  id: string;
  role: "student" | "teacher" | "admin";
  password: string;
};

export interface AuthCredentials {
  id: string;
  password: string;
}

export const addTeacherFormFields: FieldConfig[] = [
  {
    name: "id",
    label: "ID",
    type: "number",
    required: true,
    min: 100000,
    max: 999999,
    placeholder: "Enter ID",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    required: true,
    placeholder: "Enter Password",
  },
  {
    name: "name",
    label: "Name",
    type: "text",
    required: true,
    maxLength: 100,
    placeholder: "Enter Name",
  },
  {
    name: "gender",
    label: "Gender",
    type: "select",
    required: true,
    placeholder: "Select Gender",
    options: [
      { value: "male", label: "Male" },
      { value: "female", label: "Female" },
    ],
  },
  {
    name: "salary",
    label: "Salary",
    type: "number",
    required: true,
    max: 999999999,
    min: 0,
    placeholder: "Enter Salary",
  },
  {
    name: "designation",
    label: "Designation",
    type: "text",
    required: true,
    maxLength: 50,
    placeholder: "Enter Designation",
  },
];

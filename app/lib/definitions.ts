export type User = {
  id: string;
  type: "student" | "teacher" | "admin";
  password: string;
};

export type User = {
  id: string;
  role: "student" | "teacher" | "admin";
  password: string;
};

export interface AuthCredentials {
  id: string;
  password: string;
}

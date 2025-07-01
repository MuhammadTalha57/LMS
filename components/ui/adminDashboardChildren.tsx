"use client";

import { useRouter } from "next/navigation";
import CardHolder from "./cardsHolder";

export default function AdminDashboardChildren() {
  const router = useRouter();
  const btns = [
    {
      text: "Teachers",
      handleClick: () => {
        router.push("/dashboard/admin/teachers");
      },
    },
    {
      text: "Students",
      handleClick: () => {
        router.push("/dashboard/admin/students");
      },
    },
    {
      text: "Departments",
      handleClick: () => {
        router.push("/dashboard/admin/departments");
      },
    },
    {
      text: "Courses",
      handleClick: () => {
        router.push("/dashboard/admin/courses");
      },
    },
  ];

  return <CardHolder buttons={btns}></CardHolder>;
}

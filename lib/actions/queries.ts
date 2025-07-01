"use server";

import { neon } from "@neondatabase/serverless";

export async function getUserById(id: string) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const data = await sql`SELECT * FROM users WHERE id=${id}`;

  const user = Array.isArray(data) && data.length > 0 ? data[0] : null;
  return user;
}

export async function getRoleById(id: string) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const data = await sql`SELECT role FROM users WHERE id = ${id} LIMIT 1`;
  return data;
}

export async function getUserNameById(id: string) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const roleResult = await getRoleById(id);
  console.log("ROLE RESULT: ", roleResult);

  const role =
    Array.isArray(roleResult) && roleResult.length > 0
      ? roleResult[0].role
      : null;

  let data;
  if (role === "admin") {
    data = await sql`SELECT name FROM admin WHERE id = ${id}`;
  } else if (role === "teacher") {
    data = await sql`SELECT name FROM teacher WHERE id = ${id}`;
  } else if (role === "student") {
    data = await sql`SELECT name FROM student WHERE id = ${id}`;
  } else {
    console.log("Role Not Found");
  }

  const userName = Array.isArray(data) && data.length > 0 ? data[0].name : null;
  console.log("UserName", userName, data);
  return userName;
}

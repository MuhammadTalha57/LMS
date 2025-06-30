"use server";

import { neon } from "@neondatabase/serverless";

function sql() {
  return neon(`${process.env.DATABASE_URL}`);
}

export async function getUserById(id: string) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const data = await sql`SELECT * FROM users WHERE id=${id}`;
  return data;
}

export default sql();

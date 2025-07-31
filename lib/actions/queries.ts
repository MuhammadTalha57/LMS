"use server";

import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

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
    data = await sql`SELECT name FROM teachers WHERE id = ${id}`;
  } else if (role === "student") {
    data = await sql`SELECT name FROM students WHERE id = ${id}`;
  } else {
    console.log("Role Not Found");
  }

  const userName = Array.isArray(data) && data.length > 0 ? data[0].name : null;
  console.log("UserName", userName, data);
  return userName;
}

export async function addUser(data: Record<string, any>) {

  // Id Should be unique
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const result = await sql`SELECT 1 FROM users WHERE id = ${data.id} LIMIT 1`;

    if (result.length > 0) {
      throw new Error(`User with id ${data.id} already exists`);
    }
  } catch (error) {
    if(error instanceof Error) {
      console.error(error.message);
      throw new Error(error.message);
    }
    else {
      console.error("Failed to create user due to unkown error");
      throw new Error("Unknown Error");
    }
  }
  
  const hashedPass = await bcrypt.hash(data.password, 10);
  
  try {
    console.log("Creating User with data =", data);
    
    const sql = neon(`${process.env.DATABASE_URL}`);
    await sql`
      INSERT INTO users (id, role, password)
      VALUES (${data.id}, ${data.role}, ${hashedPass})
    `;
    return true;
  } catch (error) {
    if(error instanceof Error) {
      console.error("Error creating User:", error);
      throw new Error(error.message);
    }
    else {
      console.error("Error creating user due to Unknown Error");
      throw new Error("Unknown Error");
    }
  }
}

export async function updateUserPassword(data: Record<string, any>) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Optional: Check if user exists before updating
    const existingUser = await sql`SELECT 1 FROM users WHERE id = ${data.id} LIMIT 1`;
    if (existingUser.length === 0) {
      throw new Error(`User with id ${data.id} does not exist`);
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    await sql`
      UPDATE users
      SET password = ${hashedPassword}
      WHERE id = ${data.id}
    `;

    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error updating password:", error);
      throw new Error(error.message);
    } else {
      console.error("Unknown error while updating password");
      throw new Error("Unknown error");
    }
  }
}

export async function addTeacher(data: Record<string, any>) {
  data.role = "teacher";
  try {
    await addUser(data);
    const sql = neon(`${process.env.DATABASE_URL}`);
    await sql`INSERT INTO teachers (id, name, gender, salary, designation) VALUES (${data.id}, ${data.name}, ${data.gender}, ${data.salary}, ${data.designation})`;
    return true;
  } catch (error: unknown) {
    if(error instanceof Error) {
      console.error("Error creating Teacher:", error);
      throw new Error(error.message);
    }
    else {
      console.error("Unknown error", error);
      throw new Error("Unknown error");
    }
    
  }
}

export async function teacherSearchQuery(filters: Record<string, string>) {
  const sql = neon(`${process.env.DATABASE_URL}`);
  const whereClauses: string[] = [];
  const values: any[] = [];
  let paramIndex = 1;

  // Simplified SELECT: Only teacher id and name
  let baseQuery = `
    SELECT DISTINCT t.id, t.name
    FROM teachers t
    LEFT JOIN teacher_course tc ON t.id = tc.teacher_id
    LEFT JOIN departments d ON d.id = tc.dept_id
    LEFT JOIN courses c ON c.id = tc.course_id
  `;

  // Dynamic filter conditions
  if (filters.id) {
    whereClauses.push(`t.id = $${paramIndex++}`);
    values.push(filters.id);
  }

  if (filters.name) {
    whereClauses.push(`t.name ILIKE $${paramIndex++}`);
    values.push(`%${filters.name}%`);
  }

  if (filters.designation) {
    whereClauses.push(`t.designation ILIKE $${paramIndex++}`);
    values.push(`%${filters.designation}%`);
  }

  if (filters.year) {
    whereClauses.push(`tc.year = $${paramIndex++}`);
    values.push(filters.year);
  }

  if (filters.course) {
    whereClauses.push(`c.name ILIKE $${paramIndex++}`);
    values.push(`%${filters.course}%`);
  }

  // Add WHERE if filters exist
  if (whereClauses.length > 0) {
    baseQuery += ` WHERE ` + whereClauses.join(" AND ");
  }

  // Optional: Order by name
  baseQuery += ` ORDER BY t.name`;

  const result = await sql.query(baseQuery, values);
  return result;
}

export async function getTeacherDetails(rowData: any) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const data = await sql`SELECT * FROM teachers WHERE id = ${rowData.id}`;
    return data;
  } catch (error) {
    console.error("Error getting teacher details", error);
    throw error;
  }
}

export async function editTeacher(data: Record<string, any>) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    updateUserPassword(data);

    await sql`
      UPDATE teachers
      SET name = ${data.name},
          gender = ${data.gender},
          salary = ${data.salary},
          designation = ${data.designation}
      WHERE id = ${data.id};
    `;

    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error editing Teacher:", error);
      throw new Error(error.message);
    } else {
      console.error("Unknown error", error);
      throw new Error("Unknown error");
    }
  }
}

export async function deleteUser(data: Record<string, any>) {
const sql = neon(`${process.env.DATABASE_URL}`);
  try {
    const result = await sql`DELETE FROM users WHERE id = ${data.id}`;
  }
  catch (error) {
    if(error instanceof Error) {
      console.error("Error Deleting User", error);
      throw error;
    }
    else {
      console.error("Unknow Error occured while Deleting User", error);
      throw error;
    }
  }
}

export async function deleteTeacher(data: Record<string, any>) {
const sql = neon(`${process.env.DATABASE_URL}`);
  try {
    // First, delete from the `teachers` table
    await sql`DELETE FROM teachers WHERE id = ${data.id}`;

    // Then, delete the user record
    await deleteUser(data);
  }
  catch (error) {
    if(error instanceof Error) {
      console.error("Error Deleting Teacher", error);
      throw error;
    }
    else {
      console.error("Unknow Error occured while Deleting Teacher", error);
      throw error;
    }
  }
}

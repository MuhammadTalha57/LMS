import { neon } from "@neondatabase/serverless";

function sql() {
  return neon(`${process.env.DATABASE_URL}`);
}

export default sql();

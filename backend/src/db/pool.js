import pg from "pg";
import "dotenv/config";

const { Pool } = pg;

export const pool = new Pool({
  host: process.env.PGHOST || "localhost",
  port: Number(process.env.PGPORT || 5432),
  database: process.env.PGDATABASE || "biergarten",
  user: process.env.PGUSER || "biergarten_user",
  password: process.env.PGPASSWORD || "biergarten_pass",
});

pool.on("error", (err) => {
  // eslint-disable-next-line no-console
  console.error("Error inesperado en el pool de PostgreSQL", err);
});

export async function query(text, params) {
  return pool.query(text, params);
}

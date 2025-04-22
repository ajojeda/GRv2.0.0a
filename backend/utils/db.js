// backend/utils/db.js
import sql from "mssql";

const config = {
  user: "sa",
  password: "YourStrong!Passw0rd",
  database: "dbDev",
  server: "localhost",
  port: 1433,
  options: {
    trustServerCertificate: true,
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
};

let pool;

export default async function getDbConnection() {
  if (!pool) {
    pool = await sql.connect(config);
  }
  return pool;
}
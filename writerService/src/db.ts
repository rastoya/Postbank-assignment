import mysql from "mysql2/promise";
import "dotenv/config";
import { getDbConfig } from "./config";

const dbConfig = getDbConfig();

export const pool = mysql.createPool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  waitForConnections: true,
  connectionLimit: 10
});

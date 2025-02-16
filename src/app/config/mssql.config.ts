
import sql from 'mssql';
import { IConnectionConfigSqlServer } from '../interfaces/global.interface.js';
import { loadNodeEnvironment } from './dotenv.config.js';

loadNodeEnvironment();

// @ts-ignore
const sqlConfig: IConnectionConfigSqlServer = {
  user: process.env.SQLSERVER_USER ?? "",
  password: process.env.SQLSERVER_PASSWORD ?? "",
  database: process.env.SQLSERVER_DATABASE ?? "",
  server: process.env.SQLSERVER_SERVER ?? "",
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: Number(process.env.SQLSERVER_TIMEOUT),
  },
  options: {
    encrypt: process.env.SQLSERVER_ENCRYPT === "true",
    trustServerCertificate: !(process.env.SQLSERVER_TRUST === "false")
  },
  port: Number(process.env.SQLSERVER_PORT)
};

let pool: sql.ConnectionPool | null = null;

export const initSqlServerConnection = async () => {
  try {
    if (pool) return pool;
    pool = await sql.connect(`${process.env.CONNECTION_STRING}`/** sqlConfig */);
    return pool;
  } catch (error) {
    closePool();
    throw error;
  }
};

export const closePool = async () => {
  if (pool) {
    await pool.close();
    pool = null;
  }
};




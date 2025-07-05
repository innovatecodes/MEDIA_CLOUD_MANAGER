// import 'dotenv/config';
import * as dotenv from "dotenv";
import path, { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url); // Resolve o caminho completo do arquivo atual
const __dirname = dirname(__filename); // Resolve o diretório onde o arquivo está localizado

export const loadNodeEnvironment = (): dotenv.DotenvConfigOutput =>
  dotenv.config({ path: `${__dirname}/../../../.env` });

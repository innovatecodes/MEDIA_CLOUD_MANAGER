
import express from "express";
import { routes } from "./app/routes/mediaCloudManager.routes.js";
import cors from 'cors';
import { ErrorMiddleware } from "./app/middlewares/error.middleware.js";
import { corsOptions } from "./app/utils/cors-options.js";
import path, { dirname } from "node:path";
import { fileURLToPath } from 'node:url';

export const app = express();

const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename); 

app.use(express.json({ limit: '2mb' })); // Middleware para aceitar requisições com payload JSON, limitando o tamanho máximo da carga útil para 3MB
app.use(express.urlencoded({ extended: true })); // Middleware para processar application/x-www-form-urlencoded
app.use(cors(corsOptions)); // Middleware para permitir CORS, usando as opções definidas no arquivo 'cors-options.js'
app.use('/uploads', express.static(path.join(__dirname, 'assets', 'uploads'))); // Configura o caminho estático para arquivos de upload, acessíveis pela URL '/uploads'
app.use('/js', express.static(path.join(__dirname, '..', 'public', 'js'))); // Configura o caminho estático para arquivos JavaScript, acessíveis pela URL '/js'

app.use(routes); // Registra as rotas importadas de 'mediaCloudManager.routes.js' no aplicativo Express

// Middleware de erro, configura o tratamento de erros personalizados no aplicativo
new ErrorMiddleware().setError(app);


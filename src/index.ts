import { app } from "./app.js";
import { closePool } from "./app/config/mssql.config.js";
import { loadNodeEnvironment } from "./app/config/dotenv.config.js";

loadNodeEnvironment();

app.listen(process.env.PORT || process.env.STATIC_PORT);

// Fechar o pool quando o processo for interrompido (SIGINT)
process.on('SIGINT', async () => {
  await closePool(); // Fecha o pool de forma assíncrona
  process.exit(0); // Encerra o processo após o fechamento
});

  
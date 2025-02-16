// Importa a função `register` do módulo interno do Node.js chamado "node:module".
// `register` permite registrar um carregador personalizado para interpretar arquivos em tempo de execução.
import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("ts-node/esm", pathToFileURL("./"));

/*
Registra o carregador ESM do `ts-node` para permitir a execução de arquivos TypeScript diretamente.
O primeiro argumento "ts-node/esm" especifica o carregador que será usado para processar módulos ES (ECMAScript).
O segundo argumento `pathToFileURL("./")` converte o diretório atual (`./`) em uma URL de arquivo,
garantindo que o carregador se aplique corretamente ao projeto.
*/
import fs from 'fs-extra'; 
import path, { dirname } from "node:path";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url); 
const __dirname = dirname(__filename); 

(()=>{
  // Resolve o caminho absoluto para o diretório de origem 'src/app/database'
  const srcDir = path.resolve(__dirname, '..','database');
  // Resolve o caminho absoluto para o diretório de destino 'dist/app/database'
  const destDir = path.resolve('dist', 'app','database');
  // Copia todo o conteúdo do diretório de origem para o diretório de destino de forma síncrona
  fs.copySync(srcDir, destDir);  
})()

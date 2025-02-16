import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

export const resolveGlobalsPaths = () => {
    const __filename = fileURLToPath(import.meta.url); // Resolve o caminho completo do arquivo atual
    const __dirname = dirname(__filename); // Resolve o diretório onde o arquivo está localizado
    
    return { __filename, __dirname };
};



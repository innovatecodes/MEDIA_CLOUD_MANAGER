import { Request } from 'express';
import * as fs from 'node:fs/promises'; // import fs, { unlink, writeFile, } from "node:fs"
import { InternalServerError } from '../errors/internalServer.error.js';
import { v4 as uuidv4 } from 'uuid';
import path from "node:path";

const httpProtocol = (request: Request): "http" | "https" => {
    const httpProtocol = request.socket.localPort !== 443 ? "http" : "https";
    return httpProtocol;
}

const writeFileToCache = async (req: Request, filePath: string) => {
    try {
        if (!req.file) throw Error;
        await fs.writeFile(filePath, req.file?.buffer as Buffer);
    } catch (error) {
        throw new InternalServerError();
    }
}

const removeFileToCache = async (filePath: string) => {
    try {
        await fs.access(filePath);
        await fs.unlink(filePath);
    } catch (error) {
        throw new InternalServerError();
    }
}

const removeWhiteSpace = (queryString: string): string => queryString?.replace(/\s+/g, ' ').trim();

const generateRandomId = () => {
    // Gera um número aleatório entre 0 e 1 bilhão (1E9) e arredonda para o inteiro mais próximo.
    return `${uuidv4()}-${new Date().getTime()}-${Math.round(Math.random() * 1E9)}`;
}

const getFileExtension = (fileOriginalName: string) => {
    return path.extname(fileOriginalName);
}

const generateRandomFileName = (fileFieldName: string, fileOriginalName?: string) => {
    return `${fileFieldName?.replace(/_/g, '-')}-${generateRandomId()}${getFileExtension(fileOriginalName ?? "")}`;
}

const generateRandomHash = (quantity: number): string => {
    // Função para gerar uma sequência aleatória de caracteres (hash)
    // Recebe como parâmetro a quantidade de caracteres desejada (quantity)
    // Inicializa uma variável para armazenar a chave gerada
    let key: string = "";

    // Define os caracteres que podem ser usados para gerar o hash
    const characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#&*()-_=+[]{}|.<>/\\";

    // Loop que executa 'quantity' vezes, adicionando um caractere aleatório à chave
    for (let index = 0; index < quantity; index++) {
        // Gera um índice aleatório dentro do comprimento da string 'characters'
        const randomIndex = Math.floor(Math.random() * characters.length);

        // Adiciona o caractere correspondente ao índice aleatório à variável 'key'
        key += characters[randomIndex];
    }

    // Retorna a chave gerada
    return key;
};

const parseUrlSearch = (req: Request) => {
    const search = new URL(req?.url, `${req.protocol}://${req.hostname as string}`);
    return { search };
}

const removeAccents = (text?: string): string => {
    // A função normalize() é utilizada para decompor caracteres acentuados em sua forma decomponível.
    // O parâmetro "NFD" indica que queremos decompor os caracteres acentuados, ou seja, separar a letra do acento.
    // Por exemplo, 'é' se tornaria 'e' + acento agudo.
    return text?.normalize("NFD")

        // A função replace() é usada para remover os caracteres diacríticos (acentos).
        // A regex [\u0300-\u036f] é usada para identificar os caracteres diacríticos, que são os acentos.
        // A faixa \u0300-\u036f corresponde aos acentos usados em caracteres latinos.
        // O 'g' no final da regex garante que a substituição ocorra globalmente em toda a string.
        // Estamos substituindo os acentos encontrados por uma string vazia, removendo-os.
        .replace(/[\u0300-\u036f]/g, '') || "";
}

const truncateText = (text: string, characterCount: number): string => {
    return text.length >= characterCount ? `${text.substring(0, characterCount)}... ` : text;
};

export {
    writeFileToCache,
    removeFileToCache,
    removeWhiteSpace,
    generateRandomFileName,
    generateRandomHash,
    parseUrlSearch,
    removeAccents,
    truncateText,
    httpProtocol,
};
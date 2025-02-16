import { IMediaRequest } from '../interfaces/global.interface.js';
import fs from 'fs/promises';
import sql from 'mssql';
import { initSqlServerConnection } from '../config/mssql.config.js';
import { IRepository } from './repository.interface.js';
import path, { dirname } from "node:path";
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export class MediaRepository implements IRepository<sql.IResult<any>> {
    getAll = async (): Promise<sql.IResult<any>> => {
        try {
            const pool = await initSqlServerConnection();
            return await pool.query(await this.loadSqlScript('getAll'));
        } catch (error) {
            throw error;
        }
    }

    getById = async (id: number): Promise<sql.IResult<any>> => {
        try {
            const pool = await initSqlServerConnection();
            return await pool.request()
                .input('Id', sql.SmallInt, id)
                .query(await this.loadSqlScript('getById', id));
        } catch (error) {
            throw error;
        }
    }

    getFiltered = async (str: string): Promise<sql.IResult<any>> => {
        try {
            const pool = await initSqlServerConnection();
            const query = await this.loadSqlScript('filterBy');
            return await pool.request().input('Term', sql.VarChar(50), str).query(query);
        } catch (error) {
            throw error;
        }
    }

    getCategoryList = async (): Promise<sql.IResult<any>> => {
        try {
            const pool = await initSqlServerConnection();
            return await pool.query(await this.loadSqlScript('getCategoryList'));
        } catch (error) {
            throw error;
        }
    }

    save = async (data: IMediaRequest): Promise<sql.IResult<any>> => {
        const { mediaDescription, title, link, defaultImageFile, cloudinarySecureUrl, temporaryPublicId, categoryList } = data;
   
        try {
            const pool = await initSqlServerConnection();
            return await pool.request()
                .input('CategoryList', sql.VarChar(400), categoryList.join(','))
                .input('MediaDescription', sql.NVarChar(sql.MAX), mediaDescription)
                .input('Title', sql.NVarChar(80), title)
                .input('Link', sql.VarChar(250), link)
                .input('DefaultImageFile', sql.NVarChar(sql.MAX), defaultImageFile)
                .input('CloudinarySecureUrl', sql.VarChar(150), cloudinarySecureUrl)
                .input('TemporaryPublicId', sql.VarChar(100), temporaryPublicId)
                .query(await this.loadSqlScript('insert'));
        } catch (error) {
            throw error;
        }
    }

    update = async (data: IMediaRequest, id: number): Promise<sql.IResult<any>> => {
        try {
            let { mediaDescription, title, link, defaultImageFile, cloudinarySecureUrl, temporaryPublicId, categoryList } = data;

            const pool = await initSqlServerConnection();
           
            return await pool.request()
                .input('Id', sql.SmallInt, id)
                .input('CategoryList', sql.VarChar(400), categoryList.join(','))
                .input('MediaDescription', sql.NVarChar(sql.MAX), mediaDescription)
                .input('Title', sql.NVarChar(80), title)
                .input('Link', sql.VarChar(250), link)
                .input('DefaultImageFile', sql.NVarChar(sql.MAX), defaultImageFile)
                .input('CloudinarySecureUrl', sql.VarChar(150), cloudinarySecureUrl)
                .input('TemporaryPublicId', sql.VarChar(100), temporaryPublicId)
                .query(await this.loadSqlScript('update', id));
        } catch (error) {
            throw error;
        }
    }

    delete = async (id: number): Promise<sql.IResult<any>> => {
        try {
            const pool = await initSqlServerConnection();
            return await pool.request()
                .input('Id', sql.SmallInt, id)
                .query(await this.loadSqlScript('delete', id));
        } catch (error) {
            throw error;
        }
    }

    private loadSqlScript = async (script: string, id?: number | null, str?: string | null): Promise<string> => {
        try {
            let sqlScript = await fs.readFile(path.resolve(__dirname, `../database/${script}.sql`), 'utf-8');
            return sqlScript;
        } catch (error) {
            throw error;
        }
    }
}
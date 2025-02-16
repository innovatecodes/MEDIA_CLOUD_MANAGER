import { IMediaRequest } from "../interfaces/global.interface.js";

export interface IRepository<T> {
    getAll(): Promise<T>;
    getById(id: number): Promise<T>;
    getFiltered(str: string): Promise<T>;
    save(data: IMediaRequest): Promise<T>;
    update(data: IMediaRequest, id: number): Promise<T>;
    delete(id: number): Promise<T>;
}


import { Request, Response, NextFunction } from 'express';
import { HttpMethod } from '../utils/enums.js';
import { BadRequest } from '../errors/validation.error.js';

export const validateFieldsMiddleware = (req?: Request, res?: Response, next?: NextFunction) => {
    if (!req) return next?.();

    let { categoryList, mediaDescription, title, link } = req?.body;

    categoryList = (Array.isArray(categoryList) && (categoryList.includes("\"\"") || categoryList.includes("\'\'"))) || (categoryList === undefined || !categoryList || !categoryList.length || categoryList.length === 0);

    if (req.method === HttpMethod.POST) {
        if (categoryList) throw new BadRequest("Adicione ao menos uma categoria!");
        if (mediaDescription === '' || mediaDescription.trim() === '') throw new BadRequest("O campo 'descrição' não pode ser vazio!"); // Campo pode ser do tipo <textarea> (opcional)
        if (title === '') throw new BadRequest("O campo 'título' não pode ser vazio!");
        if (link === '') throw new BadRequest("O campo 'link' não pode ser vazio!");

        next?.();
    } else if ([HttpMethod.PUT].includes(req.method as HttpMethod)) {
        if (categoryList) throw new BadRequest("Adicione ao menos uma categoria!");
        next?.();
    }

    else if ([HttpMethod.DELETE, HttpMethod.GET].includes(req.method as HttpMethod))
        next?.();
}
import { Request, Response } from "express";
import { IMediaResponse, IPaginationDetails } from "../interfaces/global.interface.js";
import { EndPoint, StatusCode } from "./enums.js";
import { parseUrlSearch } from "./utils.js";

// Função de paginação com ordenação (ASC/DESC)
export const paginate = (
    req: Request,
    res: Response,
    page: number,
    limit: number,
    response: IMediaResponse[], // Lista de dados a serem paginados
    sortByField: any, // Campo para ordenação
    reverseOrder: string = 'ASC', // Ordem padrão: ascendente
) => {
    const { search } = parseUrlSearch(req); // Extrai os parâmetros de busca da URL
    // Monta a URL base da API, removendo `?` do final, se necessário
    const url = `${process.env.URL}:${process.env.PORT}${EndPoint.MEDIA}`;
    const currentUrl = url.endsWith('?') ? url.split('?').at(0) : url;
    let $page = Math.max(1, page || 1); // Garante que a página seja no mínimo 1 (se for menor ou `undefined`, assume 1)
    const totalItems = Math.max(1, response.length); // Define o número total de itens garantindo que seja no mínimo 1 
    const limitPerPage = limit; // Define o limite de itens por página
    const numberOfPages = Math.ceil(totalItems / limitPerPage); // Calcula o número total de páginas
    const offset = ($page - 1) * limitPerPage; // Calcula o deslocamento inicial para obter os itens corretos da página atual  

    // Se a página solicitada for maior que o número total de páginas, redireciona para a última página válida
    if ($page > numberOfPages) {
        $page = numberOfPages;
        if ('page' in req.query && 'limitPerPage' in req.query && 'sortByField' in req.query && 'reverseOrder' in req.query)
            return res.redirect(`${currentUrl}?page=${$page}&limitPerPage=${limitPerPage}&sortByField=${sortByField}&reverseOrder=${reverseOrder}`);

        return res.redirect(StatusCode.FOUND, `${currentUrl}?page=${$page}`);
    }

    if (search.searchParams.has('page') && Number(search.searchParams.get('page')) < 1) // Se a URL contém um parâmetro `page` menor que 1, redireciona para a URL sem parâmetros  
        return res.redirect(StatusCode.FOUND, `${currentUrl}`);

    if (search.href.includes('?') && (!search.searchParams.has('page') || !search.searchParams.has('limitPerPage') || !search.searchParams.has('sortByField') || !search.searchParams.has('reverseOrder'))) // Se a URL possui parâmetros incompletos de paginação, redireciona para a URL base
        return res.redirect(StatusCode.FOUND, `${currentUrl}`);

    const paginatedData: IMediaResponse[] = response?.slice(offset, offset + limitPerPage).sort(compareFn) ?? []; // Obtém os itens paginados e ordenados

    // Estrutura de detalhes da paginação
    const paginationDetails: IPaginationDetails = {
        page: $page,
        totalItems: totalItems,
        limitPerPage: limitPerPage,
        numberOfPages: numberOfPages,
        offset: offset,
    };

    return {
        paginationDetails,
        paginatedData,
    };

    // Função de comparação para ordenação da lista
    function compareFn(a: IMediaResponse, b: IMediaResponse) {
        // Se sortByField for um número, ordena por mediaId
        if (typeof sortByField === 'number') {
            if (a.mediaId && b.mediaId) {
                return reverseOrder === 'DESC'
                    ? b.mediaId - a.mediaId // Ordem decrescente
                    : a.mediaId - b.mediaId; // Ordem crescente
            }
        }
        // Se sortByField for uma string, ordena por título ou data de postagem
        else if (typeof sortByField === 'string') {
            if (a.title && b.title && sortByField === 'title') {
                return reverseOrder === 'DESC'
                    ? b.title.localeCompare(a.title) // Ordem decrescente
                    : a.title.localeCompare(b.title); // Ordem crescente
            }

            if (a.postedAt && b.postedAt && sortByField === 'postedAt') {
                return reverseOrder === 'DESC'
                    ? b.postedAt.getTime() - a.postedAt.getTime() // Ordem decrescente
                    : a.postedAt.getTime() - b.postedAt.getTime(); // Ordem crescente
            }

            // Se um item não tiver data de postagem, coloca ele no final
            if (!a.postedAt) return 1;
            if (!b.postedAt) return -1;
        }
        // Se não houver critério de ordenação aplicável, mantém a ordem original
        return 0;
    }

};

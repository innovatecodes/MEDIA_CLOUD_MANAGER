
export enum StatusCode {
  OK = 200, // Requisição bem-sucedida
  CREATED = 201, // Recurso criado com sucesso
  ACCEPTED = 202, // Requisição aceita, mas ainda não processada
  NO_CONTENT = 204, // Requisição bem-sucedida, mas sem conteúdo no corpo da resposta
  MOVED_PERMANENTLY = 301, // Recurso movido permanentemente para outro URI
  FOUND = 302, // Recurso encontrado temporariamente em outro URI
  SEE_OTHER = 303, // Redirecionar para outro recurso com GET
  NOT_MODIFIED = 304, // Recurso não modificado desde a última requisição
  TEMPORARY_REDIRECT = 307, // Redirecionamento temporário para outro URI
  PERMANENT_REDIRECT = 308, // Redirecionamento permanente para outro URI
  BAD_REQUEST = 400, // Requisição inválida ou malformada
  UNAUTHORIZED = 401, // Falta de autenticação ou credenciais inválidas
  PAYMENT_REQUIRED = 402, // Reservado para uso futuro
  FORBIDDEN = 403, // Acesso ao recurso negado
  NOT_FOUND = 404, // Recurso não encontrado
  METHOD_NOT_ALLOWED = 405, // Método HTTP não permitido para o recurso
  NOT_ACCEPTABLE = 406, // O servidor não pode gerar um conteúdo aceitável
  CONFLICT = 409, // Conflito com o estado atual do recurso
  GONE = 410, // Recurso não está mais disponível
  CONTENT_TOO_LARGE = 413,
  UNSUPPORTED_MEDIA_TYPE = 415, // Tipo de mídia na requisição não suportado
  TOO_MANY_REQUESTS = 429, // Número de requisições excedeu o limite
  INTERNAL_SERVER_ERROR = 500, // Erro interno no servidor
  NOT_IMPLEMENTED = 501, // Funcionalidade solicitada não implementada no servidor
  BAD_GATEWAY = 502, // O servidor recebeu uma resposta inválida ao acessar outro servidor
  SERVICE_UNAVAILABLE = 503, // O servidor está temporariamente indisponível
  GATEWAY_TIMEOUT = 504, // O servidor não recebeu uma resposta a tempo ao acessar outro servidor
}

export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
}

export enum EndPoint {
  MEDIA = "/media",
  SEARCH = "/media/search",
  MEDIA_BY_ID = "/media/:id"
}

export enum ContentType {
  JSON = "application/json",
  // PLAIN = "text/plain",
  HTML = "text/html",
  // XML = "application/xml",
}

# MEDIA CLOUD MANAGER - API

- **Descrição**: API para gerenciamento e listagem de mídias (vídeos, séries e
                músicas), utilizando banco de dados SQL Server para persistência
                de dados.
- **Versão**: 1.0
- **Autor**: Ronaldo Lopes <contato@innovatecodes.com>
- **Criado em**: 08/01/2025
- **Última atualização**: 16/02/2025

## Licença

- **Tipo**: MIT
- **URL**: [MIT License](https://opensource.org/licenses/MIT)
- **Termos**: Permite a utilização, cópia, modificação, fusão, publicação, distribuição, sublicenciamento e/ou venda de cópias do Software, desde que a cópia do aviso de copyright e a permissão sejam incluídas em todas as cópias do Software.


## Restrição de Operações

A API é restrita para operações POST, PUT e DELETE. Essas operações exigem autenticação e permissões específicas. Apenas requisições GET são públicas e podem ser utilizadas livremente.

## Instalação

1. Clone o repositório:
    ```bash
        git clone https://github.com/innovatecodes/MEDIA_CLOUD_MANAGER.git
        cd MEDIA_CLOUD_MANAGER
    ```
2. Instale as dependências:
    ```bash
        npm install
    ```
3. Configure o banco de dados no `.env.development`:
    ```env
        DB_USER= # Usuário do SQL Server
        DB_PASSWORD= # Senha do SQL Server
        DB_DATABASE= # Nome do banco de dados no SQL Server
        DB_SERVER= # Endereço do servidor SQL Server (exemplo: localhost)
        DB_TIMEOUT= # Tempo de espera em milissegundos para conexão
        DB_ENCRYPT= # Definir se a conexão deve ser criptografada
        DB_TRUST= # Define se o servidor é confiável (geralmente em conexões locais)
        DB_PORT= # Define a porta (padrão: 1433)
    ```
4. Api key:
   ```env
       API_KEY= # Chave da API para autenticação em serviços externos
   ```
5. Configure a Cloudinary no `.env.development`:
    ```env
        CLOUDINARY_CLOUD_NAME= # Nome do cloud associado à conta Cloudinary
        CLOUDINARY_API_KEY= # Chave de API usada para autenticação com os serviços do Cloudinary
        CLOUDINARY_API_SECRET= # Segredo da API usado para operações seguras no Cloudinary
    ```
6. Inicie o servidor:
    ```bash
        npm run dev
    ```
7. Ambiente de produção:
 A API já está em produção e pode ser acessada em: [API](https://mediacloudmanager.azurewebsites.net)
  
## Configuração da Cloudinary

Para permitir o upload de imagens na API, siga os passos abaixo:

1. Acesse o site da [Cloudinary](https://cloudinary.com/) e crie uma conta.
2. No painel de controle, copie as credenciais `CLOUD_NAME`, `API_KEY` e `API_SECRET`.
3. Adicione essas credenciais no arquivo `.env.development` conforme indicado na seção de instalação.
   
## Endpoints da API

### `GET /media/`
- **Descrição**: Lista todas as mídias.
- **Método HTTP**: GET
- **Resposta esperada**: Retorna todos os registros de mídias.
  - #### Exemplo de requisição:
    ```bash
        GET http://localhost:8081/media/
    ```
  - #### Exemplo de resposta: 
    ```json
        [
            {
                "mediaId": 1,
                "categoryList": [
                    "lorem ipsum"
                ],
                "mediaDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                "title": "Lorem Ipsum Dolor",
                "postedAt": "13/12/2024",
                "updatedAt": "",
                "link": "https://youtu.be/xxxxxxxxxxx",
                "defaultImageFile": "http://localhost:8081/uploads/no-image.jpg",
                "cloudinarySecureUrl": "",
                "temporaryPublicId": ""
            },
            {
                "mediaId": 2,
                "categoryList": [
                    "duis sagittis ipsum"
                ],
                "mediaDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam. Sed nisi. Nulla quis sem at nibh elementum imperdiet. Duis sagittis ipsum. Praesent mauris.",
                "title": "Consectetur Adipiscing",
                "postedAt": "13/12/2024",
                "updatedAt": "",
                "link": "https://youtu.be/yyyyyyyyyyy",
                "defaultImageFile": "http://localhost:8081/uploads/no-image.jpg",
                "cloudinarySecureUrl": "",
                "temporaryPublicId": ""
            }
        ]          
    ```
    
### `GET /media/search?search=consectetur%20adipiscing` 
- **Descrição**:  Realiza uma pesquisa de mídia com base no termo fornecido.
- **Método HTTP**: GET
- **Parâmetros**
  - **1**: `search` - Filtro por busca (opcional).  
- **Resposta esperada**: Retorna uma lista de mídias correspondente ao tipo de pesquisa selecionada.
  - #### Exemplo de requisição:
    ```bash
        GET http://localhost:8081/media/search?search=consectetur%20adipiscing
    ```
  - #### Exemplo de resposta:
    ```json
        {
            "mediaId": 3,
            "categoryList": [
                "laboris"
            ],
            "mediaDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            "title": "Lorem Ipsum 5: Operation Ipsum",
            "postedAt": "13/12/2024",
            "updatedAt": "",
            "link": "https://youtu.be/xxxxxxxxxxx",
            "defaultImageFile": "http://localhost:8081/uploads/no-image.jpg",
            "cloudinarySecureUrl": "",
            "temporaryPublicId": ""
        }         
    ```

### `GET /media/{id}`
- **Descrição**: Busca uma mídia específica pelo id.
- **Método HTTP**: GET
- **Parâmetros**: `{id}` - Id da mídia (vídeo, música, série, etc.) a ser buscada.
- **Resposta esperada**: Retorna a mídia correspondente ao id informado.
  - #### Exemplo de requisição:
    ```bash
        GET http://localhost:8081/media/4
    ```
  - #### Exemplo de resposta:
    ```json
        {
            "mediaId": 4,
            "categoryList": [
                "consectetur"
            ],
            "mediaDescription": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            "title": "Lorem Ipsum: The Play",
            "postedAt": "13/12/2024",
            "updatedAt": "",
            "link": "https://youtu.be/xxxxxxxxxxx",
            "defaultImageFile": "http://localhost:8081/uploads/no-image.jpg",
            "cloudinarySecureUrl": "",
            "temporaryPublicId": ""
        }
    ```

### `GET /media?page={page}&limitPerPage={limitPerPage}&sortByField={sortByField}&reverseOrder={reverseOrder}`

- **Descrição**: Realiza a paginação dos registros de mídias disponíveis.
- **Método HTTP**: `GET`
- **Parâmetros da Query**:
  - `page` *(opcional)*: Número da página desejada. O padrão é `1`.
  - `limitPerPage` *(opcional)*: Quantidade de itens por página. O padrão é o total de mídias disponíveis.
  - `sortByField` *(opcional)*: Campo pelo qual os resultados serão ordenados. O padrão é `mediaId`.
  - `reverseOrder` *(opcional)*: Define a ordem dos resultados. Os valores aceitos são `asc` (crescente) ou `desc` (decrescente). O padrão é `asc`.

- **Resposta esperada**: Retorna uma lista paginada de mídias.

  - #### Exemplo de Requisição:
    ```bash
        GET http://localhost:8081/media?page=2&limitPerPage=5&sortByField=title&reverseOrder=desc
    ```

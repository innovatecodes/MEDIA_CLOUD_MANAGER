-- Declara uma variável de tabela para armazenar as categorias duplicadas
DECLARE @Duplicates TABLE (Name VARCHAR(400));

-- Insere na variável de tabela @Duplicates as categorias distintas presentes na lista fornecida (@CategoryList)
-- A função STRING_SPLIT divide a string @CategoryList pelos separadores de vírgula, e o DISTINCT garante que não haja duplicatas
INSERT INTO @Duplicates (Name)
SELECT DISTINCT VALUE FROM STRING_SPLIT(@CategoryList, ',');

-- Atualiza a variável @CategoryList para ter uma lista única de categorias, concatenadas por ponto e vírgula (;)
SELECT @CategoryList = STRING_AGG(Name, ';') FROM @Duplicates;

-- Atualiza a tabela Media com os valores recebidos via parâmetros de entrada
UPDATE M
SET 
    MediaDescription = COALESCE(NULLIF(@MediaDescription, ''), MediaDescription), -- Atualiza MediaDescription se não for uma string vazia
    Title = COALESCE(NULLIF(@Title, ''), Title), -- Atualiza Title se não for uma string vazia
    Link = COALESCE(NULLIF(@Link, ''), Link), -- Atualiza Link se não for uma string vazia
    UpdatedAt = CAST(GETDATE() AS DATETIME2), -- Atualiza a data/hora de atualização
    DefaultImageFile = COALESCE(@DefaultImageFile, DefaultImageFile), -- Atualiza DefaultImageFile se o valor não for NULL
    CloudinarySecureUrl = COALESCE(@CloudinarySecureUrl, CloudinarySecureUrl), -- Atualiza CloudinarySecureUrl se o valor não for NULL
    TemporaryPublicId = COALESCE(@TemporaryPublicId, TemporaryPublicId) -- Atualiza TemporaryPublicId se o valor não for NULL
FROM dbo.Media M
WHERE MediaId = @Id;

-- A função COALESCE escolhe o primeiro valor não NULL, garantindo que o valor atual na tabela seja mantido se o valor recebido for NULL ou uma string vazia ('').

-- Laço WHILE para garantir que não haja espaços duplos em @CategoryList
-- A função CHARINDEX busca por dois espaços consecutivos na string, e o REPLACE substitui por um único espaço
-- O TRIM remove espaços em branco do começo e final da string
WHILE CHARINDEX('  ', @CategoryList) > 0 BEGIN
    SET @CategoryList = REPLACE(LOWER(TRIM(@CategoryList)), '  ', ' '); -- Substitui espaços duplos por um único espaço e converte todos os caracteres para minúsculos
END

-- Atualiza a tabela Categories para modificar os nomes das categorias associadas ao MediaId
UPDATE C
SET 
    Name = COALESCE(
        (
            -- Subconsulta que substitui o nome das categorias associadas ao MediaId com as categorias de @CategoryList
            -- A função STRING_AGG concatena os valores com ponto e vírgula, e o REPLACE altera os nomes das categorias
            SELECT DISTINCT STRING_AGG(REPLACE(C.Name, C.Name, LOWER(TRIM(@CategoryList))), ';')
            FROM dbo.MediaCategories MC
            JOIN dbo.Categories C ON MC.CategoryId = C.CategoryId
            WHERE MC.MediaId = (
                -- Obtém o MediaId correspondente da tabela Media
                SELECT M.MediaId
                FROM dbo.Media M
                WHERE M.MediaId = @Id  
            )
        ),
        Name -- Se a subconsulta não retornar um valor, mantém o valor original do campo Name
    ),
    UpdatedAt = CAST(GETDATE() AS DATETIME2) -- Atualiza a data/hora de atualização para o valor atual
OUTPUT INSERTED.CategoryId -- Retorna os IDs das categorias atualizadas
FROM dbo.Categories C
WHERE CategoryId = @Id; -- Aplica a atualização apenas às categorias associadas ao MediaId

DECLARE @GeneratedId SMALLINT;


SELECT @GeneratedId = COALESCE(MAX(Id), 1)
FROM IdStorage
WHERE Id IS NOT NULL;

EXEC sp_Insert 
    @GeneratedId,
    @CategoryList,
    @MediaDescription,
    @Title,
    @Link,
    @DefaultImageFile,
    @CloudinarySecureUrl,
    @TemporaryPublicId;
    

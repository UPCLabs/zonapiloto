package grupo4.auth_service.services;

import java.io.IOException;
import java.nio.file.*;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class StorageService {

    @Value("${storage.base-path}")
    private String basePath;

    private static final Logger LOGGER = Logger.getLogger("storage_service");

    public Resource getFile(String... pathParts) {
        try {
            Path filePath = Paths.get(basePath, pathParts).normalize();

            if (!Files.exists(filePath)) {
                throw new RuntimeException("El archivo no existe: " + filePath);
            }

            Resource resource = new UrlResource(filePath.toUri());

            if (!resource.exists() || !resource.isReadable()) {
                throw new RuntimeException(
                    "No se puede leer el archivo: " + filePath
                );
            }

            return resource;
        } catch (Exception e) {
            throw new RuntimeException(
                "Error obteniendo archivo: " + e.getMessage(),
                e
            );
        }
    }

    public String saveTemporaryFile(
        MultipartFile file,
        Long pendingUserId,
        String docName
    ) {
        try {
            Path tempFolder = Paths.get(
                basePath,
                "pending",
                "user_" + pendingUserId
            );
            Files.createDirectories(tempFolder);

            String fileName =
                docName + "_" + System.currentTimeMillis() + ".pdf";
            Path finalPath = tempFolder.resolve(fileName);

            Files.copy(
                file.getInputStream(),
                finalPath,
                StandardCopyOption.REPLACE_EXISTING
            );

            return finalPath.toString();
        } catch (IOException e) {
            throw new RuntimeException("Error guardando archivo temporal", e);
        }
    }

    public String moveToPermanentStorage(String tempUri, Long userId) {
        try {
            Path tempPath = Paths.get(tempUri);
            Path finalFolder = Paths.get(basePath, "users", "user_" + userId);
            Files.createDirectories(finalFolder);

            Path finalPath = finalFolder.resolve(tempPath.getFileName());

            Files.move(
                tempPath,
                finalPath,
                StandardCopyOption.REPLACE_EXISTING
            );

            return finalPath.toString();
        } catch (IOException e) {
            throw new RuntimeException(
                "No se pudo mover archivo a almacenamiento final",
                e
            );
        }
    }

    public void deleteTemporaryFiles(Long pendingUserId) {
        try {
            Path tempFolder = Paths.get(
                basePath,
                "pending",
                "user_" + pendingUserId
            );
            if (Files.exists(tempFolder)) {
                Files.walk(tempFolder)
                    .sorted((a, b) -> b.compareTo(a))
                    .forEach(path -> {
                        try {
                            Files.delete(path);
                        } catch (IOException e) {
                            LOGGER.warning(
                                "No se pudo eliminar archivo: " + path
                            );
                        }
                    });
            }
        } catch (IOException e) {
            LOGGER.severe(
                "Error eliminando archivos temporales: " + e.getMessage()
            );
        }
    }

    public void deleteFile(String uri) {
        try {
            Path file = Paths.get(uri);
            Files.deleteIfExists(file);
        } catch (IOException e) {
            LOGGER.severe(
                "No se pudo eliminar archivo: " + uri + ": " + e.getMessage()
            );
        }
    }
}

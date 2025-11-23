package grupo4.information_service.services;

import grupo4.information_service.dtos.AnnouncementPhotoDTO;
import grupo4.information_service.entities.AnnouncementPhoto;
import grupo4.information_service.interfaces.IAnnouncementPhotoService;
import grupo4.information_service.repositories.IAnnouncementPhotoRepo;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class AnnouncementPhotoService implements IAnnouncementPhotoService {

    private final IAnnouncementPhotoRepo repository;

    private final Path uploadDir = Path.of("/zonapiloto_images/");

    public AnnouncementPhoto createPhoto(String title, MultipartFile file)
        throws IOException {
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        String filename =
            System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path targetPath = uploadDir.resolve(filename);
        Files.copy(
            file.getInputStream(),
            targetPath,
            StandardCopyOption.REPLACE_EXISTING
        );

        AnnouncementPhoto photo = new AnnouncementPhoto();
        photo.setTitle(title);
        photo.setUrl("/zonapiloto_images/" + filename);

        return repository.save(photo);
    }

    public AnnouncementPhoto updatePhoto(
        Long id,
        String title,
        boolean active,
        MultipartFile file
    ) throws IOException {
        AnnouncementPhoto photo = repository
            .findById(id)
            .orElseThrow(() ->
                new RuntimeException("Photo no encontrada con id: " + id)
            );

        photo.setTitle(title);
        photo.setState(active);

        if (file != null && !file.isEmpty()) {
            if (photo.getUrl() != null) {
                Path oldFile = uploadDir.resolve(
                    Paths.get(photo.getUrl()).getFileName()
                );
                Files.deleteIfExists(oldFile);
            }

            String filename =
                System.currentTimeMillis() + "_" + file.getOriginalFilename();
            Path targetPath = uploadDir.resolve(filename);
            Files.copy(
                file.getInputStream(),
                targetPath,
                StandardCopyOption.REPLACE_EXISTING
            );

            photo.setUrl("/zonapiloto_images/" + filename);
        }

        return repository.save(photo);
    }

    @Override
    public boolean photoExists(Long photoId) {
        return repository.existsById(photoId);
    }

    @Override
    public AnnouncementPhoto getPhoto(Long photoId) {
        return repository
            .findByIdActive(photoId)
            .orElseThrow(() ->
                new RuntimeException("Photo no encontrada con id: " + photoId)
            );
    }

    @Override
    public AnnouncementPhoto updatePhoto(
        Long photoId,
        AnnouncementPhotoDTO request
    ) {
        AnnouncementPhoto entity = repository
            .findById(photoId)
            .orElseThrow(() ->
                new RuntimeException("Photo no encontrada con id: " + photoId)
            );
        entity.setTitle(request.getTitle());
        entity.setUrl(request.getUrl());
        return repository.save(entity);
    }

    @Override
    public AnnouncementPhoto createPhoto(AnnouncementPhotoDTO request) {
        AnnouncementPhoto entity = new AnnouncementPhoto();
        entity.setTitle(request.getTitle());
        entity.setUrl(request.getUrl());
        return repository.save(entity);
    }

    @Override
    public void deletePhoto(Long photoId) {
        repository.deleteById(photoId);
    }

    @Override
    public List<AnnouncementPhoto> getAllPhotos() {
        return repository.findAllActive();
    }

    @Override
    public List<AnnouncementPhoto> getAllAdminPhotos() {
        return repository.findAll();
    }

    @Override
    public AnnouncementPhoto getPhotoAdmin(Long photoId) {
        return repository
            .findById(photoId)
            .orElseThrow(() ->
                new RuntimeException("Photo no encontrada con id: " + photoId)
            );
    }
}

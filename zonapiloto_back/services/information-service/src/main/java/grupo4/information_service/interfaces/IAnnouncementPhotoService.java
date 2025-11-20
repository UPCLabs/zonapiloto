package grupo4.information_service.interfaces;

import grupo4.information_service.dtos.AnnouncementPhotoDTO;
import grupo4.information_service.entities.AnnouncementPhoto;
import java.util.List;

public interface IAnnouncementPhotoService {
    boolean photoExists(Long photoId);

    AnnouncementPhoto getPhoto(Long photoId);

    AnnouncementPhoto updatePhoto(Long photoId, AnnouncementPhotoDTO request);

    AnnouncementPhoto createPhoto(AnnouncementPhotoDTO request);

    void deletePhoto(Long photoId);

    List<AnnouncementPhoto> getAllPhotos();
    List<AnnouncementPhoto> getAllAdminPhotos();
}

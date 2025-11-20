package grupo4.information_service.repositories;

import grupo4.information_service.entities.AnnouncementPhoto;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface IAnnouncementPhotoRepo
    extends JpaRepository<AnnouncementPhoto, Long> {
    @Query(value = "SELECT * FROM announcements_photos", nativeQuery = true)
    List<AnnouncementPhoto> findAllIncludingInactive();
}

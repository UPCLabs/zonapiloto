package grupo4.information_service.repositories;

import grupo4.information_service.entities.AnnouncementPhoto;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface IAnnouncementPhotoRepo
    extends JpaRepository<AnnouncementPhoto, Long> {
    @Query(
        value = "SELECT * FROM announcements_photos WHERE state = true",
        nativeQuery = true
    )
    List<AnnouncementPhoto> findAllActive();

    @Query(
        value = "SELECT * FROM announcements_photos WHERE id = :id AND state = true",
        nativeQuery = true
    )
    Optional<AnnouncementPhoto> findByIdActive(@Param("id") Long id);
}

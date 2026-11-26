package grupo4.acoustic_service.repositories;

import grupo4.acoustic_service.dtos.SamplePoint;
import grupo4.acoustic_service.entities.Sample;
import grupo4.acoustic_service.enums.SampleStatus;
import grupo4.acoustic_service.enums.TimeSlot;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SampleRepository extends JpaRepository<Sample, Long> {
    @Query(
        """
        select max(s.capturedAt) from Sample s
        where s.deviceHash = :deviceHash and s.zone.id = :zoneId
          and s.status in :statuses and s.capturedAt >= :since
        """
    )
    Optional<Instant> findLastCapture(
        @Param("deviceHash") String deviceHash,
        @Param("zoneId") Long zoneId,
        @Param("statuses") List<SampleStatus> statuses,
        @Param("since") Instant since
    );

    @Query(
        """
        select s.acousticIndex from Sample s
        where s.zone.id = :zoneId and s.timeSlot = :slot
          and s.status = grupo4.acoustic_service.enums.SampleStatus.ACCEPTED
          and s.localDate >= :since
        """
    )
    List<Double> findAcceptedIndexes(
        @Param("zoneId") Long zoneId,
        @Param("slot") TimeSlot slot,
        @Param("since") LocalDate since
    );

    @Query(
        """
        select new grupo4.acoustic_service.dtos.SamplePoint(
            s.zone.id, s.localDate, s.dayOfWeek, s.timeSlot, s.acousticIndex)
        from Sample s
        where s.status = grupo4.acoustic_service.enums.SampleStatus.ACCEPTED
          and s.localDate >= :since
        """
    )
    List<SamplePoint> findAcceptedPoints(@Param("since") LocalDate since);

    @Query(
        """
        select new grupo4.acoustic_service.dtos.SamplePoint(
            s.zone.id, s.localDate, s.dayOfWeek, s.timeSlot, s.acousticIndex)
        from Sample s
        where s.status = grupo4.acoustic_service.enums.SampleStatus.ACCEPTED
          and s.zone.id = :zoneId and s.localDate >= :since
        """
    )
    List<SamplePoint> findAcceptedPointsByZone(
        @Param("zoneId") Long zoneId,
        @Param("since") LocalDate since
    );

    @Query(
        """
        select s.zone.id, s.status, s.rejectionReason, count(s)
        from Sample s where s.localDate >= :since
        group by s.zone.id, s.status, s.rejectionReason
        """
    )
    List<Object[]> countByZoneStatusAndReason(@Param("since") LocalDate since);

    @Query(
        "select count(distinct s.deviceHash) from Sample s where s.localDate >= :since"
    )
    long countDistinctDevices(@Param("since") LocalDate since);
}

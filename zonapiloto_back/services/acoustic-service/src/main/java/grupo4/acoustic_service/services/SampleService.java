package grupo4.acoustic_service.services;

import grupo4.acoustic_service.dtos.SampleRequest;
import grupo4.acoustic_service.dtos.SampleResponse;
import grupo4.acoustic_service.entities.Sample;
import grupo4.acoustic_service.entities.Zone;
import grupo4.acoustic_service.enums.NoiseLevel;
import grupo4.acoustic_service.enums.RejectionReason;
import grupo4.acoustic_service.enums.SampleStatus;
import grupo4.acoustic_service.enums.TimeSlot;
import grupo4.acoustic_service.repositories.SampleRepository;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class SampleService {

    private final SampleRepository sampleRepository;
    private final ZoneService zoneService;
    private final QualityPolicy qualityPolicy;
    private final DeviceHasher deviceHasher;
    private final Clock clock;

    @Transactional
    public SampleResponse register(SampleRequest request) {
        Zone zone = zoneService.require(request.zoneId());
        if (!zone.isActive()) {
            throw new ResponseStatusException(
                HttpStatus.UNPROCESSABLE_CONTENT,
                "La zona no está activa en el piloto"
            );
        }

        Instant now = clock.instant();
        String deviceHash = deviceHasher.hash(request.deviceId());
        enforceRateLimit(deviceHash, zone.getId(), now);

        ZonedDateTime local = now.atZone(clock.getZone());
        TimeSlot slot = TimeSlot.of(local.toLocalTime());
        double index = AcousticIndex.fromLeqDbfs(request.leqDbfs());

        Sample sample = new Sample();
        sample.setZone(zone);
        sample.setLeqDbfs(request.leqDbfs());
        sample.setAcousticIndex(index);
        sample.setDurationSeconds(request.durationSeconds());
        sample.setClippingRatio(request.clippingRatio());
        sample.setDeviceHash(deviceHash);
        sample.setCapturedAt(now);
        sample.setLocalDate(local.toLocalDate());
        sample.setDayOfWeek(local.getDayOfWeek());
        sample.setTimeSlot(slot);

        Optional<RejectionReason> rejection = qualityPolicy.reject(
            request.durationSeconds(),
            request.clippingRatio(),
            request.leqDbfs()
        );
        if (rejection.isPresent()) {
            sample.setStatus(SampleStatus.REJECTED);
            sample.setRejectionReason(rejection.get());
        } else {
            List<Double> reference = sampleRepository.findAcceptedIndexes(
                zone.getId(),
                slot,
                local.toLocalDate().minusDays(QualityPolicy.OUTLIER_WINDOW_DAYS)
            );
            sample.setStatus(
                qualityPolicy.isOutlier(index, reference)
                    ? SampleStatus.OUTLIER
                    : SampleStatus.ACCEPTED
            );
        }

        Sample saved = sampleRepository.save(sample);
        return new SampleResponse(
            saved.getId(),
            zone.getName(),
            saved.getStatus(),
            saved.getRejectionReason(),
            index,
            NoiseLevel.of(index),
            slot
        );
    }

    private void enforceRateLimit(String deviceHash, Long zoneId, Instant now) {
        Instant since = now.minus(QualityPolicy.RESUBMIT_INTERVAL);
        sampleRepository
            .findLastCapture(
                deviceHash,
                zoneId,
                List.of(SampleStatus.ACCEPTED, SampleStatus.OUTLIER),
                since
            )
            .ifPresent(last -> {
                Duration wait = Duration.between(
                    now,
                    last.plus(QualityPolicy.RESUBMIT_INTERVAL)
                );
                throw new RateLimitedException(wait);
            });
    }
}

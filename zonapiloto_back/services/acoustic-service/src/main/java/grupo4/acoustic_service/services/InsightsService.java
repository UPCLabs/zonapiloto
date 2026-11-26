package grupo4.acoustic_service.services;

import grupo4.acoustic_service.dtos.DailyPoint;
import grupo4.acoustic_service.dtos.LivePoint;
import grupo4.acoustic_service.dtos.Overview;
import grupo4.acoustic_service.dtos.QualityReport;
import grupo4.acoustic_service.dtos.SamplePoint;
import grupo4.acoustic_service.dtos.ZoneHistory;
import grupo4.acoustic_service.dtos.ZoneQuality;
import grupo4.acoustic_service.dtos.ZoneResponse;
import grupo4.acoustic_service.dtos.ZoneStatus;
import grupo4.acoustic_service.dtos.ZoneTrend;
import grupo4.acoustic_service.enums.RejectionReason;
import grupo4.acoustic_service.enums.SampleStatus;
import grupo4.acoustic_service.enums.TimeSlot;
import grupo4.acoustic_service.repositories.SampleRepository;
import java.time.Clock;
import java.time.DayOfWeek;
import java.time.Duration;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.ZonedDateTime;
import java.util.Comparator;
import java.util.EnumMap;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class InsightsService {

    public static final int DEFAULT_WINDOW_DAYS = 30;
    public static final int MAX_WINDOW_DAYS = 90;

    private final SampleRepository sampleRepository;
    private final ZoneService zoneService;
    private final Clock clock;

    public TimeSlot currentSlot() {
        return TimeSlot.of(LocalTime.now(clock));
    }

    /**
     * Zone status for a time slot of today. For the current slot, recent
     * samples take precedence over history.
     */
    public Overview overview(TimeSlot requestedSlot) {
        Instant now = clock.instant();
        ZonedDateTime localNow = now.atZone(clock.getZone());
        TimeSlot current = TimeSlot.of(localNow.toLocalTime());
        TimeSlot slot = requestedSlot == null ? current : requestedSlot;
        DayOfWeek day = localNow.getDayOfWeek();
        boolean live = slot == current;
        LocalDate since = localNow.toLocalDate().minusDays(DEFAULT_WINDOW_DAYS - 1);

        List<SamplePoint> slotPoints = sampleRepository
            .findAcceptedPoints(since)
            .stream()
            .filter(p -> p.timeSlot() == slot)
            .toList();
        Map<Long, List<Double>> bySlot = indexesByZone(slotPoints);
        Map<Long, List<Double>> byDaySlot = indexesByZone(
            slotPoints.stream().filter(p -> p.dayOfWeek() == day).toList()
        );

        Map<Long, List<LivePoint>> liveByZone = live
            ? sampleRepository
                .findAcceptedSince(
                    now.minus(Duration.ofMinutes(Aggregator.LIVE_WINDOW_MINUTES))
                )
                .stream()
                .collect(Collectors.groupingBy(LivePoint::zoneId))
            : Map.of();

        List<ZoneStatus> zones = zoneService
            .activeZones()
            .stream()
            .map(z -> {
                List<LivePoint> recent = liveByZone.getOrDefault(z.id(), List.of());
                Long minutesAgo = recent
                    .stream()
                    .map(LivePoint::capturedAt)
                    .max(Comparator.naturalOrder())
                    .map(t -> Duration.between(t, now).toMinutes())
                    .orElse(null);
                return Aggregator.resolve(
                    z,
                    recent.stream().map(LivePoint::acousticIndex).toList(),
                    minutesAgo,
                    byDaySlot.getOrDefault(z.id(), List.of()),
                    bySlot.getOrDefault(z.id(), List.of())
                );
            })
            .toList();

        return new Overview(
            slot,
            current,
            day,
            live,
            Aggregator.LIVE_WINDOW_MINUTES,
            now,
            DEFAULT_WINDOW_DAYS,
            Aggregator.MIN_SAMPLES,
            zones,
            Aggregator.forStudy(zones),
            Aggregator.forConversation(zones)
        );
    }

    private static Map<Long, List<Double>> indexesByZone(List<SamplePoint> points) {
        return points
            .stream()
            .collect(
                Collectors.groupingBy(
                    SamplePoint::zoneId,
                    Collectors.mapping(
                        SamplePoint::acousticIndex,
                        Collectors.toList()
                    )
                )
            );
    }

    public ZoneHistory history(Long zoneId, int days) {
        int window = clampWindow(days);
        ZoneResponse zone = ZoneResponse.of(zoneService.require(zoneId));
        LocalDate today = LocalDate.now(clock);
        LocalDate since = today.minusDays(window - 1);
        List<SamplePoint> points = sampleRepository.findAcceptedPointsByZone(
            zoneId,
            since
        );
        return new ZoneHistory(
            zone,
            window,
            Aggregator.matrix(points),
            Aggregator.daily(points, since, today)
        );
    }

    public List<ZoneTrend> trends(int days) {
        int window = clampWindow(days);
        LocalDate today = LocalDate.now(clock);
        LocalDate since = today.minusDays(window - 1);
        Map<Long, List<SamplePoint>> byZone = sampleRepository
            .findAcceptedPoints(since)
            .stream()
            .collect(Collectors.groupingBy(SamplePoint::zoneId));
        return zoneService
            .allZones()
            .stream()
            .map(z -> {
                List<DailyPoint> daily = Aggregator.daily(
                    byZone.getOrDefault(z.id(), List.of()),
                    since,
                    today
                );
                return new ZoneTrend(z, daily);
            })
            .toList();
    }

    public QualityReport quality(int days) {
        int window = clampWindow(days);
        LocalDate since = LocalDate.now(clock).minusDays(window - 1);

        Map<Long, long[]> perZone = new HashMap<>();
        Map<RejectionReason, Long> byReason = new EnumMap<>(RejectionReason.class);
        for (RejectionReason r : RejectionReason.values()) {
            byReason.put(r, 0L);
        }

        for (Object[] row : sampleRepository.countByZoneStatusAndReason(since)) {
            Long zoneId = (Long) row[0];
            SampleStatus status = (SampleStatus) row[1];
            RejectionReason reason = (RejectionReason) row[2];
            long count = (Long) row[3];
            long[] counts = perZone.computeIfAbsent(zoneId, k -> new long[3]);
            counts[status.ordinal()] += count;
            if (status == SampleStatus.REJECTED && reason != null) {
                byReason.merge(reason, count, Long::sum);
            }
        }

        List<ZoneQuality> zones = zoneService
            .allZones()
            .stream()
            .map(z -> {
                long[] c = perZone.getOrDefault(z.id(), new long[3]);
                return new ZoneQuality(
                    z,
                    c[SampleStatus.ACCEPTED.ordinal()],
                    c[SampleStatus.OUTLIER.ordinal()],
                    c[SampleStatus.REJECTED.ordinal()]
                );
            })
            .toList();

        long accepted = zones.stream().mapToLong(ZoneQuality::accepted).sum();
        long outliers = zones.stream().mapToLong(ZoneQuality::outliers).sum();
        long rejected = zones.stream().mapToLong(ZoneQuality::rejected).sum();
        long total = accepted + outliers + rejected;
        double rate = total == 0
            ? 0.0
            : Math.round(accepted * 1000.0 / total) / 10.0;

        return new QualityReport(
            window,
            total,
            accepted,
            outliers,
            rejected,
            rate,
            sampleRepository.countDistinctDevices(since),
            byReason,
            zones
        );
    }

    private int clampWindow(int days) {
        return Math.max(1, Math.min(MAX_WINDOW_DAYS, days));
    }
}

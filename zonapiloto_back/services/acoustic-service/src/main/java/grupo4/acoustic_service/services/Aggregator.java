package grupo4.acoustic_service.services;

import grupo4.acoustic_service.dtos.DailyPoint;
import grupo4.acoustic_service.dtos.Recommendation;
import grupo4.acoustic_service.dtos.SamplePoint;
import grupo4.acoustic_service.dtos.SlotCell;
import grupo4.acoustic_service.dtos.ZoneResponse;
import grupo4.acoustic_service.dtos.ZoneStatus;
import grupo4.acoustic_service.enums.Activity;
import grupo4.acoustic_service.enums.NoiseLevel;
import grupo4.acoustic_service.enums.StatusSource;
import grupo4.acoustic_service.enums.TimeSlot;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/** Pure aggregation over accepted samples (Increment 3). */
public final class Aggregator {

    /** Below this many samples a zone/slot is shown as "insufficient data", not ranked. */
    public static final int MIN_SAMPLES = 3;
    /** Centre of the MODERATE band: lively enough to talk without disturbing study zones. */
    public static final double CONVERSATION_TARGET =
        (NoiseLevel.QUIET_BELOW + NoiseLevel.NOISY_FROM) / 2.0;

    private Aggregator() {}

    /** Accepted samples newer than this describe the zone "right now". */
    public static final int LIVE_WINDOW_MINUTES = 60;
    /** One recent accepted sample is enough: outliers were already excluded. */
    public static final int LIVE_MIN_SAMPLES = 1;

    /** Status from a time slot's history alone. */
    public static ZoneStatus status(ZoneResponse zone, List<Double> indexes) {
        return resolve(zone, List.of(), null, List.of(), indexes);
    }

    /**
     * Picks the most specific source with enough data: live samples, then the
     * same weekday and slot, then the slot on any day.
     */
    public static ZoneStatus resolve(
        ZoneResponse zone,
        List<Double> live,
        Long minutesAgo,
        List<Double> daySlot,
        List<Double> slot
    ) {
        if (live.size() >= LIVE_MIN_SAMPLES) {
            return classified(zone, live, StatusSource.LIVE, minutesAgo);
        }
        if (daySlot.size() >= MIN_SAMPLES) {
            return classified(zone, daySlot, StatusSource.DAY_SLOT, null);
        }
        if (slot.size() >= MIN_SAMPLES) {
            return classified(zone, slot, StatusSource.SLOT, null);
        }
        return new ZoneStatus(
            zone,
            Stats.round1(Stats.median(slot)),
            NoiseLevel.NO_DATA,
            slot.size(),
            false,
            StatusSource.NO_DATA,
            null
        );
    }

    private static ZoneStatus classified(
        ZoneResponse zone,
        List<Double> values,
        StatusSource source,
        Long minutesAgo
    ) {
        Double median = Stats.round1(Stats.median(values));
        return new ZoneStatus(
            zone,
            median,
            NoiseLevel.of(median),
            values.size(),
            true,
            source,
            minutesAgo
        );
    }

    /** Study: quietest first; noisy zones are never recommended. */
    public static Recommendation forStudy(List<ZoneStatus> zones) {
        List<ZoneStatus> ranked = zones
            .stream()
            .filter(ZoneStatus::enoughData)
            .filter(z -> z.level() != NoiseLevel.NOISY)
            .sorted(Comparator.comparingDouble(ZoneStatus::medianIndex))
            .toList();
        return new Recommendation(Activity.STUDY, ranked);
    }

    /** Conversation: closest to a moderate level; quiet zones are left for studying. */
    public static Recommendation forConversation(List<ZoneStatus> zones) {
        List<ZoneStatus> ranked = zones
            .stream()
            .filter(ZoneStatus::enoughData)
            .filter(z -> z.level() != NoiseLevel.QUIET)
            .sorted(
                Comparator.comparingDouble(z ->
                    Math.abs(z.medianIndex() - CONVERSATION_TARGET)
                )
            )
            .toList();
        return new Recommendation(Activity.CONVERSATION, ranked);
    }

    public static List<SlotCell> matrix(List<SamplePoint> points) {
        Map<DayOfWeek, Map<TimeSlot, List<Double>>> grouped = points
            .stream()
            .collect(
                Collectors.groupingBy(
                    SamplePoint::dayOfWeek,
                    Collectors.groupingBy(
                        SamplePoint::timeSlot,
                        Collectors.mapping(
                            SamplePoint::acousticIndex,
                            Collectors.toList()
                        )
                    )
                )
            );
        List<SlotCell> cells = new ArrayList<>();
        for (DayOfWeek day : DayOfWeek.values()) {
            for (TimeSlot slot : TimeSlot.values()) {
                List<Double> values = grouped
                    .getOrDefault(day, Map.of())
                    .getOrDefault(slot, List.of());
                Double median = Stats.round1(Stats.median(values));
                cells.add(
                    new SlotCell(
                        day,
                        slot,
                        median,
                        values.size(),
                        values.size() >= MIN_SAMPLES
                            ? NoiseLevel.of(median)
                            : NoiseLevel.NO_DATA
                    )
                );
            }
        }
        return cells;
    }

    /** One point per calendar day in [from, to], including days without samples. */
    public static List<DailyPoint> daily(
        List<SamplePoint> points,
        LocalDate from,
        LocalDate to
    ) {
        Map<LocalDate, List<Double>> byDate = points
            .stream()
            .collect(
                Collectors.groupingBy(
                    SamplePoint::localDate,
                    Collectors.mapping(
                        SamplePoint::acousticIndex,
                        Collectors.toList()
                    )
                )
            );
        List<DailyPoint> series = new ArrayList<>();
        for (LocalDate d = from; !d.isAfter(to); d = d.plusDays(1)) {
            List<Double> values = byDate.getOrDefault(d, List.of());
            series.add(
                new DailyPoint(d, Stats.round1(Stats.median(values)), values.size())
            );
        }
        return series;
    }
}

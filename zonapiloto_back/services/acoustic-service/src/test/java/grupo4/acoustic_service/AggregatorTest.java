package grupo4.acoustic_service;

import static org.assertj.core.api.Assertions.assertThat;

import grupo4.acoustic_service.dtos.DailyPoint;
import grupo4.acoustic_service.dtos.Recommendation;
import grupo4.acoustic_service.dtos.SamplePoint;
import grupo4.acoustic_service.dtos.SlotCell;
import grupo4.acoustic_service.dtos.ZoneResponse;
import grupo4.acoustic_service.dtos.ZoneStatus;
import grupo4.acoustic_service.enums.NoiseLevel;
import grupo4.acoustic_service.enums.TimeSlot;
import grupo4.acoustic_service.services.Aggregator;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;
import org.junit.jupiter.api.Test;

class AggregatorTest {

    private static ZoneResponse zone(long id, String code) {
        return new ZoneResponse(id, code, "Sede " + code, null, 0, 0, true);
    }

    @Test
    void statusUsesMedianAndRequiresMinimumSamples() {
        ZoneStatus few = Aggregator.status(zone(1, "A"), List.of(20.0, 22.0));
        assertThat(few.enoughData()).isFalse();
        assertThat(few.level()).isEqualTo(NoiseLevel.NO_DATA);

        ZoneStatus ok = Aggregator.status(
            zone(1, "A"),
            List.of(20.0, 22.0, 90.0)
        );
        assertThat(ok.enoughData()).isTrue();
        assertThat(ok.medianIndex()).isEqualTo(22.0);
        assertThat(ok.level()).isEqualTo(NoiseLevel.QUIET);
    }

    @Test
    void studyRanksQuietestAndExcludesNoisy() {
        List<ZoneStatus> zones = List.of(
            Aggregator.status(zone(1, "A"), List.of(25.0, 25.0, 25.0)),
            Aggregator.status(zone(2, "F"), List.of(45.0, 45.0, 45.0)),
            Aggregator.status(zone(3, "G"), List.of(75.0, 75.0, 75.0)),
            Aggregator.status(zone(4, "D"), List.of(10.0))
        );
        Recommendation study = Aggregator.forStudy(zones);
        assertThat(study.ranked())
            .extracting(z -> z.zone().code())
            .containsExactly("A", "F");
    }

    @Test
    void conversationPrefersModerateAndExcludesQuiet() {
        List<ZoneStatus> zones = List.of(
            Aggregator.status(zone(1, "A"), List.of(25.0, 25.0, 25.0)),
            Aggregator.status(zone(2, "F"), List.of(48.0, 48.0, 48.0)),
            Aggregator.status(zone(3, "G"), List.of(75.0, 75.0, 75.0))
        );
        Recommendation talk = Aggregator.forConversation(zones);
        assertThat(talk.ranked())
            .extracting(z -> z.zone().code())
            .containsExactly("F", "G");
    }

    @Test
    void matrixCoversEveryDayAndSlot() {
        LocalDate monday = LocalDate.of(2026, 11, 23);
        List<SamplePoint> points = List.of(
            new SamplePoint(1L, monday, DayOfWeek.MONDAY, TimeSlot.MORNING, 30.0),
            new SamplePoint(1L, monday, DayOfWeek.MONDAY, TimeSlot.MORNING, 32.0),
            new SamplePoint(1L, monday, DayOfWeek.MONDAY, TimeSlot.MORNING, 34.0)
        );
        List<SlotCell> cells = Aggregator.matrix(points);
        assertThat(cells).hasSize(7 * TimeSlot.values().length);
        SlotCell mondayMorning = cells
            .stream()
            .filter(c -> c.day() == DayOfWeek.MONDAY && c.slot() == TimeSlot.MORNING)
            .findFirst()
            .orElseThrow();
        assertThat(mondayMorning.medianIndex()).isEqualTo(32.0);
        assertThat(mondayMorning.sampleCount()).isEqualTo(3);
    }

    @Test
    void dailySeriesFillsGaps() {
        LocalDate from = LocalDate.of(2026, 11, 20);
        LocalDate to = LocalDate.of(2026, 11, 22);
        List<SamplePoint> points = List.of(
            new SamplePoint(1L, from, DayOfWeek.FRIDAY, TimeSlot.MIDDAY, 40.0)
        );
        List<DailyPoint> daily = Aggregator.daily(points, from, to);
        assertThat(daily).hasSize(3);
        assertThat(daily.get(0).medianIndex()).isEqualTo(40.0);
        assertThat(daily.get(1).medianIndex()).isNull();
        assertThat(daily.get(2).sampleCount()).isZero();
    }
}

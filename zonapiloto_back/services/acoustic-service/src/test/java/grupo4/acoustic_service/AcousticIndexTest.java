package grupo4.acoustic_service;

import static org.assertj.core.api.Assertions.assertThat;

import grupo4.acoustic_service.enums.NoiseLevel;
import grupo4.acoustic_service.enums.TimeSlot;
import grupo4.acoustic_service.services.AcousticIndex;
import java.time.LocalTime;
import org.junit.jupiter.api.Test;

class AcousticIndexTest {

    @Test
    void mapsRangeLinearlyAndClamps() {
        assertThat(AcousticIndex.fromLeqDbfs(-70.0)).isEqualTo(0.0);
        assertThat(AcousticIndex.fromLeqDbfs(-40.0)).isEqualTo(50.0);
        assertThat(AcousticIndex.fromLeqDbfs(-10.0)).isEqualTo(100.0);
        assertThat(AcousticIndex.fromLeqDbfs(-100.0)).isEqualTo(0.0);
        assertThat(AcousticIndex.fromLeqDbfs(0.0)).isEqualTo(100.0);
    }

    @Test
    void classifiesLevels() {
        assertThat(NoiseLevel.of(null)).isEqualTo(NoiseLevel.NO_DATA);
        assertThat(NoiseLevel.of(20.0)).isEqualTo(NoiseLevel.QUIET);
        assertThat(NoiseLevel.of(35.0)).isEqualTo(NoiseLevel.MODERATE);
        assertThat(NoiseLevel.of(59.9)).isEqualTo(NoiseLevel.MODERATE);
        assertThat(NoiseLevel.of(60.0)).isEqualTo(NoiseLevel.NOISY);
    }

    @Test
    void everyHourBelongsToOneSlot() {
        assertThat(TimeSlot.of(LocalTime.of(6, 0))).isEqualTo(TimeSlot.MORNING);
        assertThat(TimeSlot.of(LocalTime.of(9, 59))).isEqualTo(TimeSlot.MORNING);
        assertThat(TimeSlot.of(LocalTime.of(10, 0))).isEqualTo(TimeSlot.MIDDAY);
        assertThat(TimeSlot.of(LocalTime.of(14, 30))).isEqualTo(TimeSlot.AFTERNOON);
        assertThat(TimeSlot.of(LocalTime.of(18, 0))).isEqualTo(TimeSlot.EVENING);
        assertThat(TimeSlot.of(LocalTime.of(23, 0))).isEqualTo(TimeSlot.EVENING);
        assertThat(TimeSlot.of(LocalTime.of(2, 0))).isEqualTo(TimeSlot.EVENING);
    }
}

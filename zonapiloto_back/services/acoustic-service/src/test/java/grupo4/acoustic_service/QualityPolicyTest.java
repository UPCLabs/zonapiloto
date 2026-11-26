package grupo4.acoustic_service;

import static org.assertj.core.api.Assertions.assertThat;

import grupo4.acoustic_service.enums.RejectionReason;
import grupo4.acoustic_service.services.QualityPolicy;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;

class QualityPolicyTest {

    private final QualityPolicy policy = new QualityPolicy();

    @Test
    void acceptsValidMeasurement() {
        assertThat(policy.reject(12.0, 0.0, -40.0)).isEmpty();
    }

    @Test
    void acceptsDurationBoundaries() {
        assertThat(policy.reject(10.0, 0.0, -40.0)).isEmpty();
        assertThat(policy.reject(15.5, 0.0, -40.0)).isEmpty();
    }

    @Test
    void rejectsTooShortOrTooLong() {
        assertThat(policy.reject(9.9, 0.0, -40.0)).contains(
            RejectionReason.DURATION_OUT_OF_RANGE
        );
        assertThat(policy.reject(30.0, 0.0, -40.0)).contains(
            RejectionReason.DURATION_OUT_OF_RANGE
        );
    }

    @Test
    void rejectsClipping() {
        assertThat(policy.reject(12.0, 0.05, -5.0)).contains(
            RejectionReason.CLIPPING
        );
    }

    @Test
    void rejectsSilentInput() {
        assertThat(policy.reject(12.0, 0.0, -120.0)).contains(
            RejectionReason.SILENT_INPUT
        );
    }

    @Test
    void noOutliersWithoutEnoughReference() {
        assertThat(policy.isOutlier(99.0, List.of(30.0, 31.0, 32.0))).isFalse();
    }

    @Test
    void flagsExtremeValueAgainstStableReference() {
        List<Double> reference = List.of(30.0, 31.0, 32.0, 30.5, 31.5, 29.5);
        assertThat(policy.isOutlier(31.0, reference)).isFalse();
        assertThat(policy.isOutlier(90.0, reference)).isTrue();
    }

    @Test
    void identicalReferenceDoesNotFlagSmallDifferences() {
        List<Double> reference = Collections.nCopies(10, 40.0);
        assertThat(policy.isOutlier(44.0, reference)).isFalse();
    }
}

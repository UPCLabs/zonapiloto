package grupo4.acoustic_service.services;

import grupo4.acoustic_service.enums.RejectionReason;
import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.OptionalDouble;
import org.springframework.stereotype.Component;

/** Sample quality rules (Increment 2). Pure logic so it can be unit-tested. */
@Component
public class QualityPolicy {

    public static final double MIN_DURATION_S = 10.0;
    public static final double MAX_DURATION_S = 15.5;
    public static final double MAX_CLIPPING_RATIO = 0.01;
    /** Below this the microphone is muted or blocked rather than measuring a quiet room. */
    public static final double SILENT_BELOW_DBFS = -90.0;

    public static final Duration RESUBMIT_INTERVAL = Duration.ofMinutes(10);
    public static final int OUTLIER_WINDOW_DAYS = 30;
    public static final int OUTLIER_MIN_REFERENCE = 5;
    /** Modified z-score threshold (Iglewicz and Hoaglin). */
    public static final double OUTLIER_Z = 3.5;
    /** Keeps the score meaningful when a zone's reference samples are nearly identical. */
    public static final double MIN_MAD = 2.0;

    public Optional<RejectionReason> reject(
        double durationSeconds,
        double clippingRatio,
        double leqDbfs
    ) {
        if (
            durationSeconds < MIN_DURATION_S || durationSeconds > MAX_DURATION_S
        ) {
            return Optional.of(RejectionReason.DURATION_OUT_OF_RANGE);
        }
        if (clippingRatio > MAX_CLIPPING_RATIO) {
            return Optional.of(RejectionReason.CLIPPING);
        }
        if (leqDbfs < SILENT_BELOW_DBFS) {
            return Optional.of(RejectionReason.SILENT_INPUT);
        }
        return Optional.empty();
    }

    public boolean isOutlier(double index, List<Double> reference) {
        if (reference.size() < OUTLIER_MIN_REFERENCE) {
            return false;
        }
        OptionalDouble median = Stats.median(reference);
        double mad = Math.max(Stats.mad(reference).orElse(0.0), MIN_MAD);
        double z = 0.6745 * Math.abs(index - median.getAsDouble()) / mad;
        return z > OUTLIER_Z;
    }
}

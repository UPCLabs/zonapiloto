package grupo4.acoustic_service.services;

import java.util.Collection;
import java.util.List;
import java.util.OptionalDouble;

/** Robust statistics; medians resist the occasional shout or slammed door. */
public final class Stats {

    private Stats() {}

    public static OptionalDouble median(Collection<Double> values) {
        if (values == null || values.isEmpty()) {
            return OptionalDouble.empty();
        }
        List<Double> sorted = values.stream().sorted().toList();
        int n = sorted.size();
        double median = n % 2 == 1
            ? sorted.get(n / 2)
            : (sorted.get(n / 2 - 1) + sorted.get(n / 2)) / 2.0;
        return OptionalDouble.of(median);
    }

    /** Median absolute deviation. */
    public static OptionalDouble mad(Collection<Double> values) {
        OptionalDouble median = median(values);
        if (median.isEmpty()) {
            return OptionalDouble.empty();
        }
        double m = median.getAsDouble();
        return median(values.stream().map(v -> Math.abs(v - m)).toList());
    }

    public static Double round1(OptionalDouble value) {
        return value.isPresent()
            ? Math.round(value.getAsDouble() * 10.0) / 10.0
            : null;
    }
}

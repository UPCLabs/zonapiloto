package grupo4.acoustic_service.enums;

public enum NoiseLevel {
    QUIET,
    MODERATE,
    NOISY,
    NO_DATA;

    public static final double QUIET_BELOW = 35.0;
    public static final double NOISY_FROM = 60.0;

    public static NoiseLevel of(Double index) {
        if (index == null) {
            return NO_DATA;
        }
        if (index < QUIET_BELOW) {
            return QUIET;
        }
        return index < NOISY_FROM ? MODERATE : NOISY;
    }
}

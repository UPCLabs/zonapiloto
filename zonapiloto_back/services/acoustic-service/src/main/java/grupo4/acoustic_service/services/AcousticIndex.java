package grupo4.acoustic_service.services;

/**
 * Maps the equivalent level measured on the device (dBFS, uncalibrated) to an
 * orientative 0-100 index. It is relative to the device microphone and is not
 * a sound pressure level in dB(A).
 *
 * The frontend mirrors this formula in src/sonoro/acoustics.js to show the
 * result immediately; the server value is the authoritative one.
 */
public final class AcousticIndex {

    public static final double FLOOR_DBFS = -70.0;
    public static final double CEILING_DBFS = -10.0;

    private AcousticIndex() {}

    public static double fromLeqDbfs(double leqDbfs) {
        double normalized =
            (leqDbfs - FLOOR_DBFS) / (CEILING_DBFS - FLOOR_DBFS);
        double clamped = Math.max(0.0, Math.min(1.0, normalized));
        return Math.round(clamped * 1000.0) / 10.0;
    }
}

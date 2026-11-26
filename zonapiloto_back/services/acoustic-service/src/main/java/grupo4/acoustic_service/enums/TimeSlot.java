package grupo4.acoustic_service.enums;

import java.time.LocalTime;

/**
 * Campus time slots. EVENING wraps past midnight so every capture belongs to
 * exactly one slot.
 */
public enum TimeSlot {
    MORNING(6, 10),
    MIDDAY(10, 14),
    AFTERNOON(14, 18),
    EVENING(18, 6);

    private final int fromHour;
    private final int toHour;

    TimeSlot(int fromHour, int toHour) {
        this.fromHour = fromHour;
        this.toHour = toHour;
    }

    public int getFromHour() {
        return fromHour;
    }

    public int getToHour() {
        return toHour;
    }

    public static TimeSlot of(LocalTime time) {
        int hour = time.getHour();
        for (TimeSlot slot : values()) {
            if (slot.fromHour <= hour && hour < slot.toHour) {
                return slot;
            }
        }
        return EVENING;
    }
}

package grupo4.acoustic_service.enums;

/** Where a zone's current reading comes from, most specific first. */
public enum StatusSource {
    /** Accepted samples captured within the live window. */
    LIVE,
    /** History for the same weekday and time slot. */
    DAY_SLOT,
    /** History for the time slot on any day. */
    SLOT,
    NO_DATA,
}

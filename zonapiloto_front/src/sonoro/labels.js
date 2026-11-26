export const LEVEL_LABEL = {
  QUIET: "Silenciosa",
  MODERATE: "Moderada",
  NOISY: "Ruidosa",
  NO_DATA: "Sin datos suficientes",
};

export const SLOTS = ["MORNING", "MIDDAY", "AFTERNOON", "EVENING"];

export const SLOT_LABEL = {
  MORNING: "Mañana",
  MIDDAY: "Mediodía",
  AFTERNOON: "Tarde",
  EVENING: "Noche",
};

export const SLOT_HOURS = {
  MORNING: "6:00–10:00",
  MIDDAY: "10:00–14:00",
  AFTERNOON: "14:00–18:00",
  EVENING: "18:00–6:00",
};

export const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export const DAY_LABEL = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

export const SOURCE_LABEL = {
  LIVE: "En vivo",
  DAY_SLOT: "Histórico de este día y franja",
  SLOT: "Histórico de la franja",
  NO_DATA: "Sin datos",
};

export const DAY_LABEL_LOWER = {
  MONDAY: "lunes",
  TUESDAY: "martes",
  WEDNESDAY: "miércoles",
  THURSDAY: "jueves",
  FRIDAY: "viernes",
  SATURDAY: "sábados",
  SUNDAY: "domingos",
};

export const REASON_LABEL = {
  DURATION_OUT_OF_RANGE: "Duración fuera de 10–15 s",
  CLIPPING: "Micrófono saturado",
  SILENT_INPUT: "Micrófono silenciado o bloqueado",
};

const indexFormat = new Intl.NumberFormat("es-CO", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const dateFormat = new Intl.DateTimeFormat("es-CO", { day: "numeric", month: "short" });
const clockFormat = new Intl.DateTimeFormat("es-CO", {
  weekday: "long",
  hour: "numeric",
  minute: "2-digit",
  timeZone: "America/Bogota",
});

/** Campus time, regardless of the visitor's device time zone. */
export const formatCampusClock = (date) => clockFormat.format(date);

export const formatIndex = (value) =>
  value === null || value === undefined ? "—" : indexFormat.format(value);

/** Formats a server LocalDate (YYYY-MM-DD) without shifting it across time zones. */
export const formatDate = (isoDate) => {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-").map(Number);
  return dateFormat.format(new Date(y, m - 1, d));
};

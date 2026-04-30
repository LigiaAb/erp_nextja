export const formatDateToText = (date: Date) => {
  const formatter = new Intl.DateTimeFormat("es-GT", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const parts = formatter.formatToParts(date);

  const get = (type: "weekday" | "day" | "month" | "year") => parts.find((p) => p.type === type)?.value;

  const weekday = get("weekday") ?? "viernes"; // viernes
  const day = get("day"); // 17
  const month = get("month"); // abril
  const year = get("year"); // 2026

  const capitalizedWeekday = weekday.charAt(0).toUpperCase() + weekday.slice(1);

  const result = `${capitalizedWeekday}(${day}) de ${month} de ${year}`;

  console.log(result);
  return result;
};

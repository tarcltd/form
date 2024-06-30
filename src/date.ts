import { parse, isValid } from "date-fns";
import { toZonedTime } from "date-fns-tz";

export function parseDate(
  value: string,
  format: "date" | "date-time" = "date"
) {
  if (format === "date") {
    for (const format of [
      "MM/dd/yy",
      "dd/MM/yy",
      "MM/dd/yyyy",
      "dd/MM/yyyy",
      "MM-dd-yy",
      "dd-MM-yy",
      "MM-dd-yyyy",
      "dd-MM-yyyy",
      "yyyy-MM-dd",
    ]) {
      const parsedDate = parse(value, format, new Date());

      if (isValid(parsedDate)) {
        return parsedDate;
      }
    }
  } else if (format === "date-time") {
    for (const format of [
      "yyyy-MM-dd'T'HH:mm:ssXXX",
      "yyyy-MM-dd'T'HH:mm:ss.SSSXXX",
      "yyyy-MM-dd'T'HH:mm:ss",
      "yyyy-MM-dd'T'HH:mm:ss.SSS",
      "yyyy-MM-dd HH:mm:ss",
      "MM/dd/yyyy HH:mm:ss",
      "MM/dd/yyyy hh:mm:ss a",
      "dd/MM/yyyy HH:mm:ss",
      "dd/MM/yyyy hh:mm:ss a",
    ]) {
      const parsedDate = parse(value, format, new Date());

      if (isValid(parsedDate)) {
        return toZonedTime(parsedDate, "UTC");
      }
    }
  }

  return null;
}

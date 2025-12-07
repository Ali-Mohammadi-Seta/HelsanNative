import moment from "moment-jalaali";

// convert miladi to shamsi date
export const convertMiladiToShamsiDate = (
  date: Date,
  format = "jYYYYjMMjDD"
) => {
  return date
    ? moment(date)
        .format(format)
        .replace(/\d/g, (d: string) =>
          String.fromCharCode(d.charCodeAt(0) + 1728)
        )
    : null;
};

// convert miladi to shamsi date
export const convertMiladiToShamsiTime = (date: Date) => {
  return date
    ? moment(date)
        .format("jYYYY/jM/jD HH:mm")
        .split(" ")[1]
        .replace(/\d/g, (d: string) =>
          String.fromCharCode(d.charCodeAt(0) + 1728)
        )
    : null;
};

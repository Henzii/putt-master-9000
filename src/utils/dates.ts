import { format, fromUnixTime } from "date-fns";

export const parseDate = (time: number, formatString = 'dd.MM.yyyy HH:mm' ) => format(fromUnixTime(time / 1000), formatString);
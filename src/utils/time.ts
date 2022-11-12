import { format, fromUnixTime } from 'date-fns';

export const stampToDateString = (stamp:number) => format(fromUnixTime(stamp / 1000), 'dd.MM.yyyy HH:mm');

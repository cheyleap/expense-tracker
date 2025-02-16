import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as isBetween from 'dayjs/plugin/isBetween';
import * as duration from 'dayjs/plugin/duration';

export const enum TimeZoneEnum {
  PHNOM_PENH = 'Asia/Phnom_Penh',
}

dayjs.extend(timezone);
dayjs.extend(utc);
dayjs.extend(customParseFormat);
dayjs.extend(isBetween);
dayjs.extend(duration);
dayjs.tz.setDefault(TimeZoneEnum.PHNOM_PENH);
export { dayjs as dayJs };

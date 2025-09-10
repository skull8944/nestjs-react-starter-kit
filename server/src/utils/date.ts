import dayjs from 'dayjs';

export class DateUtil {
  static getNowDayjs(): dayjs.Dayjs {
    return dayjs();
  }
}

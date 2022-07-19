export enum TimeValues
{
  DAY    = 'day',
  HOUR   = 'hour',
  MINUTE = 'minute',
  SECOND = 'second'
}

export interface DayHourOffsetModel
{
  dayOfWeek: number;

  hourOffset: number;
}

export enum DAY_OF_WEEK
{
  SUNDAY,
  MONDAY,
  TUESDAY,
  WEDNESDAY,
  THURSDAY,
  FRIDAY,
  SATURDAY,
  NONE
}

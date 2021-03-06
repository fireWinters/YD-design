import { Dayjs } from 'dayjs';
export declare function isTimeArrayChange(prevTime: Dayjs[], nextTime: Dayjs[]): boolean;
export declare function getAvailableDayjsLength(value: any): 0 | 1 | 2;
export declare function isDisabledDate(date: any, disabledDate: any, mode: any, originMode: any): boolean;
declare type WeekStartType = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export declare function getDefaultWeekStart(dayjsLocale: string): WeekStartType;
export {};

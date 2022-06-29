import originDayjs, { Dayjs, OpUnitType, UnitType } from 'dayjs';
export declare const dayjs: typeof originDayjs;
export declare const methods: {
    add(time: any, value: number, unit: UnitType): any;
    subtract(time: any, value: number, unit: UnitType): any;
    startOf(time: any, unit?: OpUnitType): any;
    endOf(time: any, unit?: OpUnitType): any;
    set(time: any, unit: UnitType, value: number): any;
    isSameWeek(date1: any, date2: any, weekStart: number, localeName: any): any;
};
export declare function timezoneToOffset(inputTs: number, timezone: string): any;
export declare function getNow(utcOffset?: number, timezone?: string): originDayjs.Dayjs;
export declare function toTimezone(time: Dayjs, utcOffset?: number, timezone?: string, local?: boolean): Dayjs;
export declare function toLocal(time: Dayjs, utcOffset?: number, timezone?: string): Dayjs;
export declare function getTimeFormat(format: any): string;
export declare function getDayjsValue(time: any, format: string, utcOffset?: number, timezone?: string): originDayjs.Dayjs | originDayjs.Dayjs[];
export declare function getValueWithTime(date: Dayjs, time?: Dayjs): Dayjs;
export declare function getSortedDayjsArray(values?: Dayjs[]): originDayjs.Dayjs[];
export declare function isDayjsChange(prevValue: Dayjs | undefined, currentValue: Dayjs | undefined): boolean | originDayjs.Dayjs;
export declare function isDayjsArrayChange(prevValue: Dayjs[] | undefined, currentValue: Dayjs[] | undefined): boolean | originDayjs.Dayjs[];
export declare function isValidTimeString(str: string, format: any): boolean;
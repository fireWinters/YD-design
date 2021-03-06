import dayjs from 'dayjs';
import { isArray, isDayjs } from '../_util/is';
function getFormat(time) {
    return isDayjs(time) && time.format('HH:mm:ss');
}
export function isTimeArrayChange(prevTime, nextTime) {
    return (getFormat(prevTime[0]) !== getFormat(nextTime[0]) ||
        getFormat(prevTime[1]) !== getFormat(nextTime[1]));
}
export function getAvailableDayjsLength(value) {
    if (!value) {
        return 0;
    }
    if (isArray(value)) {
        if (isDayjs(value[0]) && isDayjs(value[1])) {
            return 2;
        }
        if (!isDayjs(value[0]) && !isDayjs(value[1])) {
            return 0;
        }
        return 1;
    }
    return 0;
}
export function isDisabledDate(date, disabledDate, mode, originMode) {
    if (typeof disabledDate !== 'function') {
        return false;
    }
    if (!originMode || originMode === mode) {
        return disabledDate(date);
    }
    return disabledDate(date.startOf(mode)) && disabledDate(date.endOf(mode));
}
export function getDefaultWeekStart(dayjsLocale) {
    var _a, _b;
    return ((_b = (_a = dayjs.Ls) === null || _a === void 0 ? void 0 : _a[dayjsLocale]) === null || _b === void 0 ? void 0 : _b.weekStart) || 0;
}

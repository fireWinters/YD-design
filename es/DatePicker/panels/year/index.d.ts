import { ReactNode } from 'react';
import { Dayjs } from 'dayjs';
import { YearPickerProps } from '../../interface';
interface InnerYearPickerProps extends YearPickerProps {
    dateRender?: (currentDate: Dayjs) => ReactNode;
    disabledDate?: (current: Dayjs) => boolean;
    onMouseEnterCell?: (time: Dayjs, disabled: boolean) => void;
    onMouseLeaveCell?: (time: Dayjs, disabled: boolean) => void;
    pageShowDate?: Dayjs;
    isRangePicker?: boolean;
    rangeValues?: Dayjs[];
    onSuperPrev?: () => void;
    onSuperNext?: () => void;
    originMode?: 'date' | 'week' | 'month' | 'year' | 'quarter';
}
declare function YearPicker(props: InnerYearPickerProps): JSX.Element;
declare namespace YearPicker {
    var defaultProps: {
        pickerType: string;
    };
}
export default YearPicker;

import 'dayjs/locale/zh-tw';
var Calendar = {
    formatYear: 'YYYY 年',
    formatMonth: 'YYYY 年 MM 月',
    today: '今天',
    view: {
        month: '月',
        year: '年',
        week: '周',
        day: '日',
    },
    month: {
        long: {
            January: '一月',
            February: '二月',
            March: '三月',
            April: '四月',
            May: '五月',
            June: '六月',
            July: '七月',
            August: '八月',
            September: '九月',
            October: '十月',
            November: '十一月',
            December: '十二月',
        },
        short: {
            January: '一月',
            February: '二月',
            March: '三月',
            April: '四月',
            May: '五月',
            June: '六月',
            July: '七月',
            August: '八月',
            September: '九月',
            October: '十月',
            November: '十一月',
            December: '十二月',
        },
    },
    week: {
        long: {
            self: '周',
            monday: '周一',
            tuesday: '周二',
            wednesday: '周三',
            thursday: '周四',
            friday: '周五',
            saturday: '周六',
            sunday: '周日',
        },
        short: {
            self: '周',
            monday: '一',
            tuesday: '二',
            wednesday: '三',
            thursday: '四',
            friday: '五',
            saturday: '六',
            sunday: '日',
        },
    },
};
export default {
    locale: 'zh-TW',
    dayjsLocale: 'zh-tw',
    Calendar: Calendar,
    DatePicker: {
        Calendar: Calendar,
        placeholder: {
            date: '請選擇日期',
            week: '請選擇周',
            month: '請選擇月份',
            year: '請選擇年份',
            quarter: '請選擇季度',
        },
        placeholders: {
            date: ['開始日期', '結束日期'],
            week: ['開始周', '結束周'],
            month: ['開始月份', '結束月份'],
            year: ['開始年份', '結束年份'],
            quarter: ['開始季度', '結束季度'],
        },
        selectTime: '選擇時間',
        selectDate: '選擇日期',
        today: '今天',
        now: '此刻',
        ok: '確認',
    },
    Drawer: {
        okText: '確認',
        cancelText: '取消',
    },
    Empty: {
        noData: '暫無數據',
    },
    Modal: {
        okText: '確認',
        cancelText: '取消',
    },
    Pagination: {
        goto: '前往',
        page: '頁',
        countPerPage: '個/頁',
        total: '共 {0} 個',
        prev: '上一頁',
        next: '下一頁',
        currentPage: '第 {0} 頁',
        prevSomePages: '向前 {0} 頁',
        nextSomePages: '向后 {0} 頁',
        pageSize: '頁碼',
    },
    Popconfirm: {
        okText: '確認',
        cancelText: '取消',
    },
    Table: {
        okText: '確認',
        resetText: '重置',
        sortAscend: '點擊升序',
        sortDescend: '點擊降序',
        cancelSort: '取消排序',
    },
    TimePicker: {
        ok: '確認',
        placeholder: '請選擇時間',
        placeholders: ['開始時間', '結束時間'],
        now: '此刻',
    },
    Progress: {
        success: '完成',
        error: '失敗',
    },
    Upload: {
        start: '開始',
        cancel: '取消',
        delete: '删除',
        reupload: '點擊重試',
        upload: '點擊上傳',
        preview: '預覽',
        drag: '點擊或拖拽文件到此處上傳',
        dragHover: '釋放文件並開始上傳',
        error: '上傳失敗',
    },
    Typography: {
        copy: '複製',
        copied: '已復制',
        edit: '編輯',
        fold: '折疊',
        unfold: '展開',
    },
    Transfer: {
        resetText: '重置',
    },
    ImagePreview: {
        fullScreen: '全屏',
        rotateRight: '向右旋轉',
        rotateLeft: '向左旋轉',
        zoomIn: '放大',
        zoomOut: '縮小',
        originalSize: '原始尺寸',
    },
    Form: {
        validateMessages: {
            required: '#{field} 是必填項',
            type: {
                string: '#{value} 不是合法的文本類型',
                number: '#{value} 不是合法的數字類型',
                boolean: '#{value} 不是合法的布爾類型',
                array: '#{value} 不是合法的數組類型',
                object: '#{value} 不是合法的對像類型',
                url: '#{value} 不是合法的 url 地址',
                email: '#{value} 不是合法的郵箱地址',
                ip: '#{value} 不是合法的 IP 地址',
            },
            number: {
                min: '`#{value}` 小於最小值 `#{min}`',
                max: '`#{value}` 大於最大值 `#{max}`',
                equal: '`#{value}` 不等於 `#{equal}`',
                range: '`#{value}` 不在 `#{min} ~ #{max}` 範圍內',
                positive: '`#{value}` 不是正數',
                negative: '`#{value}` 不是負數',
            },
            array: {
                length: '`#{value}` 個數不等於 #{length}',
                minLength: '`#{value}` 個數最少為 #{minLength}',
                maxLength: '`#{value}` 個數最多為 #{maxLength}',
                includes: '#{value} 不包含 #{includes}',
                deepEqual: '#{value} 不等於 #{deepEqual}',
                empty: '`#{value}` 不是空數組',
            },
            string: {
                minLength: '字符數最少為 #{minLength}',
                maxLength: '字符數最多為 #{maxLength}',
                length: '`#{value}` 字符數不等於 #{length}',
                match: '`#{value}` 不符合模式 #{pattern}',
                uppercase: '`#{value}` 不是全大寫',
                lowercase: '`#{value}` 不是全小寫',
            },
            object: {
                deepEqual: '`#{value}` 不等於 #{deepEqual}',
                hasKeys: '`#{value}` 不包含字段 #{keys}',
                empty: '`#{value}` 不是對象',
            },
            boolean: {
                true: '期望是 `true`',
                false: '期望是 `false`',
            },
        },
    },
};

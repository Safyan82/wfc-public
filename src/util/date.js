import dayjs from "dayjs";

export const createdDateList = [
    {
        title: 'Today',
        subtitle: 'Today from midnight until the current time',
        value: dayjs().format('YYYY-MM-DD'),
    },
    {
        title: 'Yesterday',
        subtitle: 'The previous 24 hours day',
        value: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    },
    {
        title: 'Tomorrow',
        subtitle: 'The next 24 hours day',
        value: dayjs().add(1, 'day').format('YYYY-MM-DD'),
    },
    {
        title: 'This week',
        subtitle: 'The current calendar week',
        value: dayjs().startOf('week').format('YYYY-MM-DD') +"|"+ dayjs().startOf('week').format('YYYY-MM-DD'),
    },
    {
        title: 'This week so far',
        subtitle: 'The current calendar week up to now',
        value: dayjs().startOf('week').format('YYYY-MM-DD')+"|"+dayjs().format('YYYY-MM-DD'),
    },
    {
        title: 'Last Week',
        subtitle: 'The previous calendar week',
        value: dayjs().subtract(1, 'week').startOf('week').format('YYYY-MM-DD')+"|"+dayjs().subtract(1, 'week').endOf('week').format('YYYY-MM-DD'),
    },
    {
        title: 'Next Week',
        subtitle: 'The next calendar week',
        value: dayjs().add(1, 'week').startOf('week').format('YYYY-MM-DD')+"|"+dayjs().add(1, 'week').endOf('week').format('YYYY-MM-DD'),
    },
    {
        title: 'This month',
        subtitle: 'The current calendar month',
        value: dayjs().startOf('month').format('YYYY-MM-DD')+"|"+dayjs().endOf('month').format('YYYY-MM-DD'),
    },
    {
        title: 'This month so far',
        subtitle: 'The current calendar month up to now',
        value: dayjs().startOf('month').format('YYYY-MM-DD')+"|"+dayjs().format('YYYY-MM-DD'),

    },
    {
        title: 'Last month',
        subtitle: 'The previous calendar month up to now',
        value: dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD')+"|"+dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD'),
    },
    {
        title: 'Next month',
        subtitle: 'The next calendar month',
        value: dayjs().add(1, 'month').startOf('month').format('YYYY-MM-DD')+"|"+dayjs().add(1, 'month').endOf('month').format('YYYY-MM-DD'),
    },
    {
        title: 'This quarter',
        subtitle: 'The current quarter',
    },
    {
        title: 'This fiscal quarter',
        subtitle: 'The current fiscal quarter',
    },
    {
        title: 'This quarter so far',
        subtitle: 'The current quarter up to now',
    },
    {
        title: 'This fiscal quarter so far',
        subtitle: 'The current fiscal quarter up to now',
    },
    {
        title: 'Last quarter',
        subtitle: 'The previous full quarter',
    },
    {
        title: 'Last fiscal quarter',
        subtitle: 'The previous full fiscal quarter',
    },
    {
        title: 'Next quarter',
        subtitle: 'The next full quarter',
    },
    {
        title: 'Next fiscal quarter',
        subtitle: 'The next full fiscal quarter',
    },
    {
        title: 'This year',
        subtitle: 'The current calendar year',
    },
    {
        title: 'This fiscal year',
        subtitle: 'The current fiscal year',
    },
    {
        title: 'This year so far',
        subtitle: 'The current calendar year up to now',
    },
    {
        title: 'This fiscal year so far',
        subtitle: 'The current fiscal year up to now',
    },
    {
        title: 'Last year',
        subtitle: 'The previous calendar year',
    },
    {
        title: 'Last fiscal year',
        subtitle: 'The previous fiscal year',
    },
    {
        title: 'Last 7 days',
        subtitle: 'The previous 7 days before today',
    },
    {
        title: 'Last 14 days',
        subtitle: 'The previous 14 days before today',
    },
    {
        title: 'Last 30 days',
        subtitle: 'The previous 30 days before today',
    },
    {
        title: 'Last 60 days',
        subtitle: 'The previous 60 days before today',
    },
    {
        title: 'Last 90 days',
        subtitle: 'The previous 90 days before today',
    },
    {
        title: 'Last 180 days',
        subtitle: 'The previous 180 days before today',
    },
    {
        title: 'Last 365 days',
        subtitle: 'The previous 365 days before today',
    },
]
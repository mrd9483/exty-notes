import { ITimeEntry } from '@/data/models/TimeEntry';
import format from 'date-fns/format';
import _ from 'lodash';

const getEntries = async (userId?: string, dateFrom?: Date | null, dateTo?: Date | null) => {
    let dateQuery = '';

    if (dateFrom && dateTo) {
        dateQuery = `?dateFrom=${format(dateFrom, 'yyyy-MM-dd')}&dateTo=${format(dateTo, 'yyyy-MM-dd')}`;
    }

    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/timeEntries/user/${userId}${dateQuery}`)
        .then(res => res.json());
};

const saveEntry = (userId: string, date: Date, entry: string, hours: number) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/timeEntries/`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: userId, entry, date, hours })
        });
};

const deleteEntry = (entryId: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/timeEntries/${entryId}`, { method: 'DELETE' })
        .then(res => res.json());
};

export type ITimeEntryReport = {
    date: string,
    sum: number
}

const entryReport = (entries: ITimeEntry[]): ITimeEntryReport[] => {
    const entryGroup = _.groupBy(entries, (e) => { return format(new Date(e.date), 'yyyy-MM-dd'); });
    const aggregate = _.map(Object.keys(entryGroup), (eg) => {
        return { date: eg, sum: _.sumBy(entryGroup[eg], (ent) => ent.hours) };
    });

    return aggregate;
};

export { getEntries, saveEntry, deleteEntry, entryReport };

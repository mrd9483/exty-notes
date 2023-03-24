import { ITimeEntry } from '@/data/models/TimeEntry';
import format from 'date-fns/format';
import _, { Dictionary } from 'lodash';
import axios from 'axios';

const getEntries = async (userId?: string, dateFrom?: Date | null, dateTo?: Date | null): Promise<ITimeEntry[]> => {
    let dateQuery = '';

    if (dateFrom && dateTo) {
        dateQuery = `?dateFrom=${format(dateFrom, 'yyyy-MM-dd')}&dateTo=${format(dateTo, 'yyyy-MM-dd')}`;
    }

    return (await axios.get<ITimeEntry[]>(`/timeEntries/user/${userId}${dateQuery}`)).data;
};

const saveEntry = async (userId: string, date: Date, entry: string, hours: number): Promise<ITimeEntry> => {
    return (await axios.put<ITimeEntry>('/timeEntries', { user: userId, entry, date, hours })).data;
};

const deleteEntry = async (entryId: string) => {
    return (await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/timeEntries/${entryId}`)).data;
};

export type ITimeEntryReport = {
    date: string,
    sum: number
}

const entryGroup = (entries: ITimeEntry[]): Dictionary<ITimeEntry[]> => {
    return _.groupBy(entries, (e) => { return format(new Date(e.date), 'yyyy-MM-dd'); });
};

const entryReport = (entries: ITimeEntry[]): ITimeEntryReport[] => {
    const entryGroupRetVal = entryGroup(entries);
    const aggregate = _.map(Object.keys(entryGroupRetVal), (eg) => {
        return { date: eg, sum: _.sumBy(entryGroupRetVal[eg], (ent) => ent.hours) };
    });

    return aggregate;
};

export { getEntries, saveEntry, deleteEntry, entryGroup, entryReport };

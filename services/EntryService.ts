import { ITimeEntry } from '@/data/models/TimeEntry';
import format from 'date-fns/format';
import _, { Dictionary } from 'lodash';
import { CrudUser } from './crud';

export type ITimeEntryReport = {
    date: string,
    sum: number
}

export default class EntryService extends CrudUser<ITimeEntry> {
    constructor() {
        super('/timeEntries');
    }

    async getEntries(userId: string, dateFrom?: Date | null, dateTo?: Date | null): Promise<ITimeEntry[]> {
        const params = [];

        if (dateFrom && dateTo) {
            params.push(['dateFrom', dateFrom]);
            params.push(['dateTo', dateFrom]);
        }

        return this.queryByUserId(userId, params);
    }

    static entryGroup(entries: ITimeEntry[]): Dictionary<ITimeEntry[]> {
        return _.groupBy(entries, (e) => { return format(new Date(e.date), 'yyyy-MM-dd'); });
    }

    static entryReport (entries: ITimeEntry[]): ITimeEntryReport[] {
        const entryGroupRetVal = EntryService.entryGroup(entries);
        const aggregate = _.map(Object.keys(entryGroupRetVal), (eg) => {
            return { date: eg, sum: _.sumBy(entryGroupRetVal[eg], (ent) => ent.hours) };
        });

        return aggregate;
    }
}

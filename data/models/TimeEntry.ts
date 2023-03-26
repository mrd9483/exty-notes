import { Schema, model, models } from 'mongoose';
import { IUserBase } from './Base';

interface ITimeEntry extends IUserBase {
    entry: string,
    date: Date,
    hours: number
}

const timeEntrySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updated: { type: Date, default: Date.now },
    entry: { type: String, required: true },
    date: Date,
    category: String,
    hours: { type: Number, min: 0, max: 24, required: true },
});

const TimeEntry = models.TimeEntry || model<ITimeEntry>('TimeEntry', timeEntrySchema);

export default TimeEntry;
export type { ITimeEntry };

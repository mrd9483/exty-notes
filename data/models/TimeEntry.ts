import { Schema, model, models } from 'mongoose';

interface ITimeEntry {
    _id: string,
    user: string,
    updated: Date,
    entry: string,
    date: Date,
    hours: number
}

const timeEntrySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
    updated: { type: Date, default: Date.now },
    entry: String,
    date: Date,
    hours: { type: Number, min: 0, max: 24 }
});

const TimeEntry = models.TimeEntry || model<ITimeEntry>('TimeEntry', timeEntrySchema);

export default TimeEntry;
export type { ITimeEntry };

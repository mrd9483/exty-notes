import { Decimal } from '@prisma/client/runtime';
import { Schema, model, models } from 'mongoose';

const timeEntrySchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
    updated: { type: Date, default: Date.now },
    entry: String,
    date: Date,
    hours: { type: Decimal, min: 0, max: 24 }
});

const TimeEntry = models.TimeEntry || model('TimeEntry', timeEntrySchema);

export default TimeEntry;

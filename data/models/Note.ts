import { Schema, model, models } from 'mongoose';
import { IUserBase } from './Base';
interface INote extends IUserBase {
    note?: string,
    title: string,
    active?: boolean,
    tags?: string[]
}

interface INoteTitleOnly {
    _id: string,
    title: string
}

const noteSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
    updated: { type: Date, default: Date.now },
    note: { type: String, default: '', require: false },
    title: String,
    active: { type: Boolean, default: true },
    tags: [String],
});

const Note = models.Note || model<INote>('Note', noteSchema);

export default Note;
export type { INote, INoteTitleOnly };

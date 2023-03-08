import { Schema, model, models } from 'mongoose';

interface INote {
    _id: string,
    user: string,
    updated: Date,
    slug: string,
    note: string,
    title: string,
    active: boolean
}

interface INoteTitleOnly {
    _id: string,
    title: string
}

const noteSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
    updated: { type: Date, default: Date.now },
    slug: String,
    note: String,
    title: String,
    active: Boolean,
});

const Note = models.Note || model<INote>('Note', noteSchema);

export default Note;
export type { INote, INoteTitleOnly };

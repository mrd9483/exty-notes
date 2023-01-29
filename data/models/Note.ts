import { Schema, model, models, Document } from 'mongoose';

interface INote {
    _id: string,
    user: string,
    updated: Date,
    slug: string,
    note: string,
    title: string,
    active: boolean
}

const noteSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
    updated: { type: Date, default: Date.now },
    slug: String,
    note: String,
    title: String,
    active: Boolean
});

const Note = models.Note || model<INote>('Note', noteSchema);

export default Note;
export type { INote };

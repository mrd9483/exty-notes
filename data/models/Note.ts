import { Schema, model, models } from 'mongoose';

const noteSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
    updated: { type: Date, default: Date.now },
    slug: String,
    note: String,
    title: String
});

const Note = models.Note || model('Note', noteSchema);

export default Note;

import { Schema, model, models } from 'mongoose';
import { IUserBase } from './Base';

interface ITemplate extends IUserBase {
    shortcut: string,
    template: string
}

const templateSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    updated: { type: Date, default: Date.now },
    shortcut: { type: String, required: true, maxLength: 20 },
    template: { type: String, default: '' },
});

const Template = models.Template || model<ITemplate>('Template', templateSchema);

export default Template;
export type { ITemplate };

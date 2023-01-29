import { Schema, model, models, Document, Types } from 'mongoose';

interface INavigation {
    user: string
    updated: Date,
    notes: Array<{
        title: string;
        note: Types.ObjectId
    }>
}

interface INavigationModel extends INavigation, Document { }

const navigationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
    updated: { type: Date, default: Date.now },
    notes: [new Schema({ title: String, note: { type: Schema.Types.ObjectId, ref: 'Notes', require: true } }, { _id: false })]
});

const Navigation = models.Navigation || model<INavigationModel>('Navigation', navigationSchema);

export default Navigation;
export type { INavigation, INavigationModel };

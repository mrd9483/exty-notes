import { Schema, model, models } from 'mongoose';

const navigationSubSchema = new Schema();

const navigationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
    updated: { type: Date, default: Date.now },
    title: String,
    note: { type: Schema.Types.ObjectId, ref: 'Notes', require: true },
    navigation: [navigationSubSchema]
});

navigationSchema.add({
    updated: { type: Date, default: Date.now },
    title: String,
    note: { type: Schema.Types.ObjectId, ref: 'Notes', require: true },
    navigation: [navigationSubSchema]
});

const Navigation = models.Navigation || model('Navigation', navigationSchema);

export default Navigation;

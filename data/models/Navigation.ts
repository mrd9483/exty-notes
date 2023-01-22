import { Schema, model, models } from 'mongoose';

const navigationSubSchema = new Schema({
    updated: { type: Date, default: Date.now },
    title: String,
    note: { type: Schema.Types.ObjectId, ref: 'Notes', require: true },
}, { _id: false });

navigationSubSchema.add({
    navigation: [navigationSubSchema]
});

const navigationSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
    updated: { type: Date, default: Date.now },
    title: String,
    note: { type: Schema.Types.ObjectId, ref: 'Notes', require: true },
    navigation: [navigationSubSchema]
});

const Navigation = models.Navigation || model('Navigation', navigationSchema);

export default Navigation;

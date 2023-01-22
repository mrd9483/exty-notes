import { Schema, model, models } from 'mongoose';

const taskSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
    updated: { type: Date, default: Date.now },
    task: String,
    isComplete: Boolean,
    dateCompleted: Date,
    dateScheduled: Date
});

const Task = models.Task || model('Task', taskSchema);

export default Task;

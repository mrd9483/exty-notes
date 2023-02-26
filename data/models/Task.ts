import { Schema, model, models } from 'mongoose';

interface ITask {
    _id: string,
    user: string,
    updated: Date,
    note: string,
    task: string,
    isComplete: boolean,
    dateCompleted: Date,
    dateScheduled: Date
}

const taskSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
    updated: { type: Date, default: Date.now },
    note: { type: Schema.Types.ObjectId, ref: 'Note', require: false },
    task: String,
    isComplete: { type: Boolean, default: false },
    dateCompleted: Date,
    dateScheduled: Date
});

const Task = models.Task || model<ITask>('Task', taskSchema);

export default Task;
export type { ITask };

import { Schema, model, models } from 'mongoose';
import { IUserBase } from './Base';

interface ITask extends IUserBase {
    note?: string,
    task: string,
    isComplete?: boolean,
    dateCompleted?: Date,
    dateScheduled?: Date,
    taskType: string,
}

const taskSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', require: true },
    updated: { type: Date, default: Date.now },
    note: { type: Schema.Types.ObjectId, ref: 'Note', require: false },
    task: String,
    isComplete: { type: Boolean, default: false },
    dateCompleted: Date,
    dateScheduled: Date,
    taskType: String,
});

const Task = models.Task || model<ITask>('Task', taskSchema);

export default Task;
export type { ITask };

import { ITask } from '@/data/models/Task';
import { CrudUser } from './crud';

export default class TaskService extends CrudUser<ITask> {
    constructor() {
        super('/tasks');
    }

    async setComplete(id: string): Promise<ITask> {
        return super.updateVoid(id, { setComplete: true });
    }
}

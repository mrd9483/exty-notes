import { ITask } from '@/data/models/Task';
import axios from 'axios';

const saveTask = async (userId: string, task: string, taskType?: string, dateCompleted?: Date): Promise<ITask> => {
    return (await axios.put<ITask>('/tasks', { user: userId, task, dateCompleted, taskType })).data;
};

const getTasks = async (userId?: string, returnComplete?: boolean): Promise<ITask[]> => {
    return (await axios.get<ITask[]>(`$/tasks/user/${userId}?returnComplete=${returnComplete}`)).data;
};

const setTaskComplete = async (taskId: string): Promise<ITask> => {
    return (await axios.post<ITask>(`/tasks/${taskId}?setComplete=true`)).data;
};

export { saveTask, getTasks, setTaskComplete };

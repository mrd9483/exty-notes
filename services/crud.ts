import { IBase, IUserBase } from '@/data/models/Base';
import ResourceNotFoundError from '@/utils/errors/ResourceNotFoundError';
import axios from 'axios';

export class Crud<T extends IBase> {
    protected path: string;

    constructor(path: string) {
        this.path = path;
    }

    async create(data: T): Promise<T> {
        return (await axios.put<T>(this.path, data)).data;
    }

    async readOne(id: string): Promise<T> {
        return (await axios.get<T>(`${this.path}/${id}`)).data;
    }

    async query(params: URLSearchParams): Promise<T[]> {
        return (await axios.get<T[]>(this.path, { params })).data;
    }

    async update(data: T): Promise<T> {
        if (data._id) {
            return (await axios.post<T>(`${this.path}/${data._id}`, data)).data;
        } else {
            throw new ResourceNotFoundError();
        }
    }

    async updateVoid(id: string, params?: unknown): Promise<T> {
        return (await axios.post(`${this.path}/${id}`, null, { params })).data;
    }

    async delete(id: string): Promise<void> {
        (await axios.delete(`${this.path}/${id}`));
    }
}

export class CrudUser<T extends IUserBase> extends Crud<T> {
    protected userPath: string;
    constructor(path: string) {
        super(`${path}`);
        this.userPath = `${path}/user`;
    }

    async queryByUserId(userId: string, params?: unknown): Promise<T[]> {
        return (await axios.get<T[]>(`${this.userPath}/${userId}`, { params })).data;
    }
}

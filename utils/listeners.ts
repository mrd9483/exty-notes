import { Subject } from 'rxjs';

const subject = new Subject();

export const taskService = {
    setData: (id: string) => subject.next(id),
    getData: () => subject.asObservable()
};

export const timeService = {
    setData: (id: string) => subject.next(id),
    getData: () => subject.asObservable()
};

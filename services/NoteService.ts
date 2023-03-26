import { INote } from '@/data/models/Note';
import { CrudUser } from './crud';

export default class NoteService extends CrudUser<INote> {
    constructor() {
        super('/notes');
    }

    async copyNote(id: string): Promise<INote> {
        const note = await this.readOne(id);
        note._id = undefined;
        note.title = 'COPY - ' + note.title;

        return await this.create(note);
    }
}

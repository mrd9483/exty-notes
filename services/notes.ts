import { INote } from '@/data/models/Note';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const humanize = require('humanize');

const saveContent = (noteId: string, content: string, title: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${noteId}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ note: content, title })
        });
};

const addNote = async (userId: string, title: string, content?: string) => {
    const note = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: userId, title, note: content ?? '' })
        }).then(res => res.json());

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/navigations/user/${userId}`,
        {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ note: note._id, title: humanize.truncatechars(title, 30) })
        }).then(res => res.json());

    return note;
};

const getContent = async (noteId: string): Promise<INote> => {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${noteId}`)
        .then(res => res.json());
};

const copyNote = async (id: string) => {
    const note = await getContent(id);
    return await addNote(note.user, 'COPY ' + note.title, note.note);
};

export { saveContent, addNote, getContent, copyNote };

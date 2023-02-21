import { INote } from '@/data/models/Note';

const saveContent = (noteId: string, content: string, title: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${noteId}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ note: content, title })
        })
        .then(res => res.json());
};

const addNote = async (userId: string, title: string, content?: string) => {
    const note = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: userId, title, note: content ?? '' })
        }).then(res => res.json());

    return note;
};

const getNote = async (noteId: string): Promise<INote> => {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${noteId}`)
        .then(res => res.json());
};

const copyNote = async (id: string) => {
    const note = await getNote(id);
    return await addNote(note.user, 'COPY ' + note.title, note.note);
};

const getNotesByUserId = async (userId: string, titlesOnly?: boolean) => {
    const titlesOnlyStr = titlesOnly ? '?titlesOnly=true' : '';
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/user/${userId}${titlesOnlyStr}`)
        .then(res => res.json());
};

export { saveContent, addNote, getNote, copyNote, getNotesByUserId };

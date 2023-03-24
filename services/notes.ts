import { INote } from '@/data/models/Note';
import axios from 'axios';

const saveContent = async (noteId: string, content: string, title: string) : Promise<INote> => {
    return (await axios.post(`/notes/${noteId}`, JSON.stringify({ note: content, title }))).data;
};

const addNote = async (userId: string, title: string, content?: string) : Promise<INote> => {
    const note = await axios.put<INote>(`${process.env.NEXT_PUBLIC_API_URL}/notes`, { user: userId, title, note: content ?? '' });
    return note.data;
};

const getNote = async (noteId: string): Promise<INote> => {
    return (await axios.get<INote>(`/notes/${noteId}`)).data;
};

const copyNote = async (id: string) : Promise<INote> => {
    const note = await getNote(id);
    return await addNote(note.user, 'COPY ' + note.title, note.note);
};

const getNotesByUserId = async (userId: string, titlesOnly?: boolean) : Promise<INote[]> => {
    const titlesOnlyStr = titlesOnly ? '?titlesOnly=true' : '';
    return (await axios.get<INote[]>(`/notes/user/${userId}${titlesOnlyStr}`)).data;
};

export { saveContent, addNote, getNote, copyNote, getNotesByUserId };

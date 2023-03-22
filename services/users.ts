import { IUser } from '@/data/models/User';
import axios from 'axios';

// const saveContent = (noteId: string, content: string, title: string) => {
//     return axios.post(`/notes/${noteId}`, JSON.stringify({ note: content, title }));
// };

// const addNote = async (userId: string, title: string, content?: string) => {
//     const note = await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/notes`, { user: userId, title, note: content ?? '' });
//     return note.data;
// };

const getUser = async (userId: string): Promise<IUser> => {
    return (await axios.get(`/users/${userId}`)).data;
};

// const copyNote = async (id: string) => {
//     const note = await getNote(id);
//     return await addNote(note.user, 'COPY ' + note.title, note.note);
// };

// const getNotesByUserId = async (userId: string, titlesOnly?: boolean) => {
//     const titlesOnlyStr = titlesOnly ? '?titlesOnly=true' : '';
//     return (await axios.get(`/notes/user/${userId}${titlesOnlyStr}`)).data;
// };

//export { saveContent, addNote, getUser, copyNote, getNotesByUserId };
export { getUser };

const saveContent = (noteId: string, content: string, title: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${noteId}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ note: content, title })
        });
};

const addNote = async (userId: string, title: string) => {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: userId, title })
        }).then(res => res.json());
};

export { saveContent, addNote };

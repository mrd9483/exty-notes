const saveContent = (noteId: string, content: string, title: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${noteId}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ note: content, title })
        });
};

export { saveContent };

const getTemplates = async (userId: string) => {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates/user/${userId}`)
        .then(res => res.json());
};

const getTemplateByShortcut = async (userId: string, shortcut: string) => {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates/user/${userId}/${shortcut}`)
        .then(res => res.json());
};

const addTemplate = (userId: string, template: string, shortcut: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates/`,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: userId, template, shortcut })
        });
};

const updateTemplate = (id: string, userId: string, template: string, shortcut: string) => {
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates/${id}`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user: userId, template, shortcut })
        });
};

const deleteTemplate = async (entryId: string) => {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates/${entryId}`, { method: 'DELETE' });
};

const getTemplate = async (id: string) => {
    return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/templates/${id}`)
        .then(res => res.json());
};

export { getTemplates, updateTemplate, deleteTemplate, getTemplateByShortcut, getTemplate, addTemplate };

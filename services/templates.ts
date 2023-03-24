import { ITemplate } from '@/data/models/Template';
import axios from 'axios';

const getTemplates = async (userId: string): Promise<ITemplate[]> => {
    return (await axios.get<ITemplate[]>(`/templates/user/${userId}`)).data;
};

const getTemplateByShortcut = async (userId: string, shortcut: string): Promise<ITemplate> => {
    return (await axios.get<ITemplate>(`/templates/user/${userId}/${shortcut}`)).data;
};

const addTemplate = async (userId: string, template: string, shortcut: string): Promise<ITemplate> => {
    return (await axios.put<ITemplate>('/templates/', { user: userId, template, shortcut })).data;
};

const updateTemplate = async (id: string, userId: string, template: string, shortcut: string): Promise<ITemplate> => {
    return (await axios.post<ITemplate>(`/templates/${id}`, { user: userId, template, shortcut })).data;
};

const deleteTemplate = async (entryId: string) => {
    return await axios.delete(`/templates/${entryId}`);
};

const getTemplate = async (id: string) => {
    return (await axios.get(`/templates/${id}`)).data;
};

export { getTemplates, updateTemplate, deleteTemplate, getTemplateByShortcut, getTemplate, addTemplate };

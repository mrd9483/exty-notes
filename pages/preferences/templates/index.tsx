import { Layout } from '@/components/layouts/Layout';
import { ActionIcon, Button, Container, Group, Input, List, Modal } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { IconTrash } from '@tabler/icons';
import { addTemplate, deleteTemplate, getTemplates } from '@/services/templates';
import { ITemplate } from '@/data/models/Template';
import Link from 'next/link';

const TemplateIndex = () => {
    const [data, setData] = useState<ITemplate[]>([]);
    const [templateToDelete, setTemplateToDelete] = useState<string[]>([]);
    const [addModelOpen, setAddModelOpen] = useState(false);
    const [shortcutName, setShortcutName] = useState('');

    const { data: session, status } = useSession();

    const getTemplatesUI = () => {
        getTemplates(session?.user.id as string)
            .then((d) => {
                setData(d);
            });
    };

    useEffect(() => {
        const runEffect = async () => {
            if (status === 'authenticated') {
                await getTemplatesUI();
            }
        };

        runEffect();
    }, [status]);

    const handleAddModal = async () => {
        setAddModelOpen(true);
    };

    const handleAdd = async () => {
        await addTemplate(session?.user.id as string, '', shortcutName);
        await getTemplatesUI();
        setAddModelOpen(false);
    };

    const handleDeleteModal = async (template: ITemplate) => {
        setTemplateToDelete([template._id as string, template.shortcut]);
    };

    const handleDeleteTemplate = async () => {
        await deleteTemplate(templateToDelete[0]);
        setTemplateToDelete([]);
        getTemplatesUI();
    };

    return (
        <Layout>
            <Container size="xs" px="xs">
                <List sx={{ width: '100%' }} listStyleType='none'>
                    {data.map((d: ITemplate) => (
                        <List.Item sx={{ display: 'block', div: { width: '100%' } }} key={d._id}>
                            <Group position='apart'>
                                <Link href={`/preferences/templates/${d._id}`}>{d.shortcut}</Link>
                                <ActionIcon size="md" onClick={() => handleDeleteModal(d)}>
                                    <IconTrash size={14} />
                                </ActionIcon>
                            </Group>
                        </List.Item>
                    ))}
                </List>
                <Button mt="md" sx={{ width: '100%' }} onClick={handleAddModal} variant="gradient">Add</Button>
            </Container>
            <Modal
                opened={templateToDelete.length > 0}
                onClose={() => setTemplateToDelete([])}
                withCloseButton={false}
            >
                {
                    <>
                        <Container py='md'>
                            Really delete <strong>{templateToDelete[1]}</strong>?
                        </Container>
                        <Group position="center" pt='md'>
                            <Button variant='outline' size='sm' color='red' onClick={handleDeleteTemplate}>Yes</Button>
                            <Button onClick={() => setTemplateToDelete([])}>No</Button>
                        </Group>
                    </>
                }
            </Modal>
            <Modal
                opened={addModelOpen}
                onClose={() => setAddModelOpen(false)}
                withCloseButton={false}
            >
                {
                    <>
                        <Container py='md'>
                            <Input variant="default" value={shortcutName} onChange={(e) => setShortcutName(e.currentTarget.value)} placeholder="Shortcut (can be changed later)" mb="xl" styles={() => ({ input: { height: '35px', borderBottom: '1px solid', fontWeight: 'bold' } })} radius="xs" size="xl" />
                        </Container>
                        <Group position="center" pt='md'>
                            <Button variant="gradient" onClick={handleAdd}>Add</Button>
                        </Group>
                    </>
                }
            </Modal>
        </Layout>
    );
};

export default TemplateIndex;

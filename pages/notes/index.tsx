import NoteLayout from '@/components/layouts/NoteLayout';
import { ActionIcon, Box, Button, Card, Center, Container, Grid, Group, Modal, Text, validateJson } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { IconCopy, IconTrash } from '@tabler/icons';
import { MouseEvent, useState } from 'react';
import { INote } from '@/data/models/Note';
import { useRouter } from 'next/router';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';

import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { copyNote, getNotesByUserId } from '@/services/notes';

import _ from 'lodash';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);

    return {
        props:
        {
            notes: await getNotesByUserId(session?.user.id as string)
        }
    };
};

type Props = {
    notes: Array<INote>
}

const Home: React.FC<Props> = (props) => {
    const router = useRouter();

    const [opened, setOpened] = useState(false);
    const [idToDelete, setIdToDelete] = useState('');

    const handleDeleteModal = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, id: string) => {
        setOpened(true);
        setIdToDelete(id);
        e.stopPropagation();
    };

    const handleNavigation = (id: string) => {
        router.push(`/notes/${id}`);
    };

    const handleClose = () => {
        setIdToDelete('');
        setOpened(false);
    };

    const handleDelete = async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/${idToDelete}`, { method: 'DELETE' }).then(res => res.json());
        handleClose();
        router.replace(router.asPath);
    };

    const handleCopy = async (id: string) => {
        const note = await copyNote(id);
        handleNavigation(note._id);
    };

    const getJsonFromN = (n: INote) => {
        const jsonObj = (n.note !== '' && validateJson(n.note)) ? JSON.parse(n.note) : [];
        const settings = [StarterKit, Link, Underline, TaskList, TaskItem, Table, TableCell, TableHeader, TableRow];
        const html = generateHTML({ type: 'doc', content: jsonObj }, settings);
        return html;
    };

    return (
        <NoteLayout notes={props.notes}>
            <Container size="lg" px="xs">
                <Grid>
                    {props.notes.map(n => (
                        <Grid.Col sx={{
                            cursor: 'pointer'
                        }} onClick={() => handleNavigation(n._id)} key={n._id} span={4}>
                            <Card withBorder shadow="sm" radius="md">
                                <Card.Section withBorder inheritPadding py="xs">
                                    <Group position="apart">
                                        <Text weight={500}>{_.truncate(n.title, { length: 30 })}</Text>
                                        <Group spacing="xs">
                                            <ActionIcon onClick={() => handleCopy(n._id)}>
                                                <IconCopy size={18} />
                                            </ActionIcon>
                                            <ActionIcon onClick={(e) => handleDeleteModal(e, n._id)}>
                                                <IconTrash size={18} />
                                            </ActionIcon>
                                        </Group>
                                    </Group>
                                </Card.Section>
                                <Box mt="sm" color="dimmed" h={200}>
                                    <Text size={12}>
                                        <div dangerouslySetInnerHTML={{ __html: getJsonFromN(n) }}></div>
                                    </Text>
                                </Box>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            </Container>
            <Modal
                opened={opened}
                onClose={handleClose}
                title="Delete?"
                transition="fade"
                transitionDuration={600}
                transitionTimingFunction="ease"
            >

                <Text align='center' weight={500} mb="xl">Are you sure you would like to delete?</Text>
                <Center>
                    <Group position='apart'>
                        <Button onClick={handleDelete} variant="gradient" color="red">Yes</Button>
                        <Button variant="outline" onClick={handleClose} color="red">No</Button>
                    </Group>
                </Center>
            </Modal>
        </NoteLayout>
    );
};

export default Home;

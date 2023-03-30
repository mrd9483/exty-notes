import { NoNoteLayout } from '@/components/layouts/NoNoteLayout';
import { Button, Center, Group, Modal, Text } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { MouseEvent, useState } from 'react';
import { INoteTitleOnly } from '@/data/models/Note';
import { useRouter } from 'next/router';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';

import NoteService from '@/services/NoteService';
import NoteList from '@/components/notes/NoteList';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);
    const noteService = new NoteService();

    return {
        props:
        {
            notes: await noteService.queryByUserId(session?.user.id as string, { titlesOnly: true }),
        },
    };
};

type Props = {
    notes: Array<INoteTitleOnly>
}

const Home = (props: Props) => {
    const noteService = new NoteService();
    const router = useRouter();

    const [opened, setOpened] = useState(false);
    const [idToDelete, setIdToDelete] = useState('');

    const handleDeleteModal = (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, id?: string) => {
        setOpened(true);
        setIdToDelete(id as string);
        e.stopPropagation();
    };

    const handleNavigation = (id?: string) => {
        router.push(`/notes/${id}`);
    };

    const handleClose = () => {
        setIdToDelete('');
        setOpened(false);
    };

    const handleDelete = async () => {
        await noteService.delete(idToDelete);
        handleClose();
        router.replace(router.asPath);
    };

    const handleCopy = async (id?: string) => {
        const note = await noteService.copyNote(id as string);
        handleNavigation(note._id);
    };

    return (
        <NoNoteLayout>
            <NoteList notes={props.notes} handleCopy={handleCopy} handleDeleteModal={handleDeleteModal} />
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
        </NoNoteLayout>
    );
};

export default Home;

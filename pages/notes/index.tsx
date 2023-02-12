import NoteLayout from '@/components/NoteLayout';
import { Container, Card, Grid, Group, Text, ActionIcon, Modal, Box, Button, Center, validateJson } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { INavigation } from '@/data/models/Navigation';
import { IconTrash } from '@tabler/icons';
import { MouseEvent, useState } from 'react';
import { INote } from '@/data/models/Note';
import { useRouter } from 'next/router';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { generateHTML } from '@tiptap/html';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/navigations/user/${session?.user.id}`);
    const data = await res.json();

    const noteRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/notes/user/${session?.user.id}`);
    const noteData = await noteRes.json();

    return { props: { navigation: data, notes: noteData } };
};

type Props = {
    navigation: INavigation,
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
        await fetch(`http://localhost:3000/api/notes/${idToDelete}`, { method: 'DELETE' }).then(res => res.json());
        handleClose();
        router.replace(router.asPath);
    };

    const getJsonFromN = (n: INote) => {
        const jsonObj = (n.note !== '' && validateJson(n.note)) ? JSON.parse(n.note): [];
        const html = generateHTML({ type: 'doc', content: jsonObj }, [StarterKit, Link, Underline]);
        return html;
    };

    return (
        <NoteLayout navigation={props.navigation}>
            <Container size="lg" px="xs">
                <Grid>
                    {props.notes.map(n => (
                        <Grid.Col sx={{
                            cursor: 'pointer'
                        }} onClick={() => handleNavigation(n._id)} key={n._id} span={4}>
                            <Card withBorder shadow="sm" radius="md">
                                <Card.Section withBorder inheritPadding py="xs">
                                    <Group position="apart">
                                        <Text weight={500}>{n.title}</Text>
                                        <ActionIcon onClick={(e) => handleDeleteModal(e, n._id)}>
                                            <IconTrash size={18} />
                                        </ActionIcon>
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
                        <Button onClick={() => handleDelete()} color="red">Yes</Button>
                        <Button variant="outline" onClick={() => handleClose()} color="red">No</Button>
                    </Group>
                </Center>
            </Modal>
        </NoteLayout>
    );
};

export default Home;

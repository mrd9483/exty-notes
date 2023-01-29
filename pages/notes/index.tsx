import NoteLayout from '@/components/NoteLayout';
import { Container, Card, Grid, Group, Text, ActionIcon, Modal, Box } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { INavigation } from '@/data/models/Navigation';
import { IconTrash } from '@tabler/icons';
import { useState } from 'react';
import { INote } from '@/data/models/Note';
import { useRouter } from 'next/router';

export const getServerSideProps: GetServerSideProps = async () => {
    const res = await fetch('http://localhost:3000/api/navigations/user/63d559fbd82fcc2c546416e2');
    const data = await res.json();

    const noteRes = await fetch('http://localhost:3000/api/notes/user/63d559fbd82fcc2c546416e2');
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

    const handleDelete = () => {
        setOpened(true);
    };

    const handleNavigation = (id: string) => {
        router.push(`/notes/${id}`);
    };

    return (
        <NoteLayout navigation={props.navigation}>
            <Container size="lg" px="xs">
                <Grid>
                    {props.notes.map(n => (
                        <Grid.Col sx={{
                            cursor:'pointer'
                        }} onClick={() => handleNavigation(n._id)} key={n._id} span={4}>
                            <Card withBorder shadow="sm" radius="md">
                                <Card.Section withBorder inheritPadding py="xs">
                                    <Group position="apart">
                                        <Text weight={500}>{n.title}</Text>
                                        <ActionIcon onClick={() => handleDelete()}>
                                            <IconTrash size={18} />
                                        </ActionIcon>
                                    </Group>
                                </Card.Section>
                                <Box mt="sm" color="dimmed" h={200}>
                                    <Text size={12}>
                                        {n.note}
                                    </Text>
                                </Box>
                            </Card>
                        </Grid.Col>
                    ))}
                </Grid>
            </Container>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Delete?"
                transition="fade"
                transitionDuration={600}
                transitionTimingFunction="ease"
            >
                <Text weight={500}>Are you sure you would like to delete?</Text>
            </Modal>
        </NoteLayout>
    );
};

export default Home;

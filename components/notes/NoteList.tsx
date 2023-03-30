import { INoteTitleOnly } from '@/data/models/Note';
import { ActionIcon, Card, Container, Grid, Group, Text } from '@mantine/core';
import { IconCopy, IconTrash } from '@tabler/icons';
import { MouseEvent } from 'react';
import _ from 'lodash';
import mongoose from 'mongoose';
import router from 'next/router';

type Props = {
    notes: Array<INoteTitleOnly>,
    displayOnly?: boolean,
    handleCopy?: (_id?: string) => Promise<void> | null,
    handleDeleteModal?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, _id?: string) => void | null
}

const NoteList = (props: Props) => {
    const handleNavigation = (id?: string) => {
        router.push(`/notes/${id}`);
    };
    
    return (
        <Container size="lg" px="xs">
            <Grid>
                {props.notes.map(n => (
                    <Grid.Col sx={{
                        cursor: 'pointer',
                    }} onClick={() => handleNavigation(n._id)} key={n._id} span={12}>
                        <Card withBorder shadow="sm" radius="md">
                            <Card.Section withBorder inheritPadding py="xs">
                                <Group position="apart">
                                    <Text weight={500} variant="gradient" gradient={{ from: 'indigo', to: 'darkgreen', deg: 45 }}>{_.truncate(n.title, { length: 60 })}</Text>
                                    <Group spacing="xs">
                                        <Text italic size="sm" color="gray">{new mongoose.Types.ObjectId(n._id).getTimestamp().toDateString()}</Text>
                                        {!props.displayOnly && (<>
                                            <ActionIcon onClick={() => props.handleCopy && props.handleCopy(n._id)}>
                                                <IconCopy size={18} />
                                            </ActionIcon>
                                            <ActionIcon onClick={(e) => props.handleDeleteModal && props.handleDeleteModal(e, n._id)}>
                                                <IconTrash size={18} />
                                            </ActionIcon>
                                        </>
                                        )}
                                    </Group>
                                </Group>
                            </Card.Section>
                        </Card>
                    </Grid.Col>
                ))}
            </Grid>
        </Container>
    );
};

export default NoteList;

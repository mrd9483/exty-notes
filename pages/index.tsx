import { NoNoteLayout } from '@/components/layouts/NoNoteLayout';
import NoteService from '@/services/NoteService';
import { Container, Grid, Text } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';
import { INoteTitleOnly } from '@/data/models/Note';
import { TaskList } from '@/components/tasks/TaskList';
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

    return (
        <NoNoteLayout>
            <Container size="lg" mt="lg" px="xs">
                <Grid>
                    <Grid.Col span={6}>
                        <Text mb="md" weight={500} size="xl" variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}>Tasks</Text>
                        <TaskList displayOnly categories={[]} />
                    </Grid.Col>
                    <Grid.Col span={6}>
                    <Text mb="md" weight={500} size="xl" variant="gradient" gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}>Notes</Text>
                        <NoteList displayOnly notes={props.notes} />
                    </Grid.Col>

                </Grid>
            </Container>
        </NoNoteLayout>
    );
};

export default Home;

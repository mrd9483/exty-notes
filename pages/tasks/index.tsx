import { NoNoteLayout } from '@/components/layouts/NoNoteLayout';
import { TaskList } from '@/components/tasks/TaskList';
import { Container, Tabs } from '@mantine/core';
import { IconCheckbox, IconSquare } from '@tabler/icons';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth';
import { getUser } from '@/services/users';
import { IUser } from '@/data/models/User';

type Props = {
    currentUser: IUser
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);

    return {
        props: {
            currentUser: await getUser(session?.user.id as string),
        },
    };
};

const Task = (props: Props) => {
    const [tab, setTab] = useState('');

    const handleTabChange = (tabUX: string) => {
        setTab(tabUX);
    };

    return (
        <NoNoteLayout>
            <Container size="sm" px="xs">
                <Tabs defaultValue="todo" onTabChange={handleTabChange}>
                    <Tabs.List position="right">
                        <Tabs.Tab icon={<IconSquare size={14} />} value="todo">
                            Incompleted
                        </Tabs.Tab>
                        <Tabs.Tab icon={<IconCheckbox size={14} />} value="complete">
                            Completed
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>
                <TaskList categories={props.currentUser?.options?.taskTypes ?? []} showComplete={tab === 'complete'} />
            </Container>
        </NoNoteLayout>
    );
};

export default Task;

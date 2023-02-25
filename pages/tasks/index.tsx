import NoNoteLayout from '@/components/NoNoteLayout';
import TaskList from '@/components/TaskList';
import { Container, Tabs } from '@mantine/core';
import { IconCheckbox, IconSquare } from '@tabler/icons';
import { useState } from 'react';

const Task: React.FC = () => {
    const [tab, setTab] = useState('');


    const handleTabChange = (tabUX: string) => {
        setTab(tabUX);
    };

    return (
        <NoNoteLayout>
            <Container size="sm" px="xs">
                <Tabs  defaultValue="todo" onTabChange={handleTabChange}>
                    <Tabs.List position="right">
                        <Tabs.Tab icon={<IconSquare size={14} />} value="todo">
                            Incompleted
                        </Tabs.Tab>
                        <Tabs.Tab icon={<IconCheckbox size={14} />} value="complete">
                            Completed
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>
                <TaskList showComplete={tab === 'complete'} />
            </Container>
        </NoNoteLayout>
    );
};

export default Task;

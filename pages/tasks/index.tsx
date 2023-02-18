import NoNoteLayout from '@/components/NoNoteLayout';
import TaskList from '@/components/TaskList';
import { Container } from '@mantine/core';

const Task: React.FC = () => {
    return (
        <NoNoteLayout>
            <Container size="lg" px="xs">
                <TaskList />
            </Container>
        </NoNoteLayout>
    );
};

export default Task;

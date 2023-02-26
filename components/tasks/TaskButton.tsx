import { ITask } from '@/data/models/Task';
import { ActionIcon } from '@mantine/core';
import { IconSquare, IconSquareCheck } from '@tabler/icons';
import { useState } from 'react';

type TaskButtonProps = {
    handleRowClick: (id: string) => Promise<void>
    task: ITask
}


const TaskButton: React.FC<TaskButtonProps> = (props) => {
    const [loading, setLoading] = useState(false);

    const handleRowClick = () => {
        setLoading(true);
        props.handleRowClick(props.task._id)
            .then(() => setLoading(false));

    };

    return (
        <ActionIcon loading={loading} onClick={handleRowClick} variant="default">
            {props.task.isComplete ? <IconSquareCheck /> : <IconSquare />}
        </ActionIcon>
    );
};

export default TaskButton;

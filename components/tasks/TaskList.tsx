import { Button, Container, Grid, Table, Text, TextInput } from '@mantine/core';
import { ITask } from '@/data/models/Task';
import { useEffect, useState } from 'react';
import { isNotEmpty, useForm } from '@mantine/form';
import { useSession } from 'next-auth/react';
import { getTasks, saveTask, setTaskComplete } from '@/services/tasks';
import { taskService } from '@/utils/listeners';
import { TaskButton } from './TaskButton';

type Props = {
    showComplete?: boolean
}

export const TaskList = (props: Props) => {

    const [data, setData] = useState<ITask[]>([]);
    const [addLoading, setAddLoading] = useState(false);
    const [dataAdded, setDataAdded] = useState('');

    const { data: session, status } = useSession();

    const form = useForm({
        validateInputOnBlur: true,
        initialValues: {
            task: ''
        },
        validate: {
            task: isNotEmpty()
        }
    });

    taskService.getData().subscribe((id) => {
        setDataAdded(id as string);
    });

    useEffect(() => {
        const runEffect = async () => {
            console.log(status);
            if (status === 'authenticated') {
                setData(await getTasks(session?.user.id, props.showComplete));
            }
        };

        runEffect();
    }, [status, dataAdded, props.showComplete]);

    const handleAdd = async () => {
        if (!form.validate().hasErrors) {
            setAddLoading(true);

            await saveTask(session?.user.id as string, form.values.task)
                .then(() => getTasks(session?.user.id, props.showComplete)
                    .then((d) => {
                        setData(d);
                        setAddLoading(false);
                    }));

            form.reset();
        }
    };

    const handleRowClick = async (id: string) => {
        await setTaskComplete(id);
        setData(await getTasks(session?.user.id, props.showComplete));
    };

    const handleEnter = async (event: { key: string; }) => {
        if (event.key === 'Enter') {
            await handleAdd();
        }
    };

    return (<>
        <Table>
            <thead>
                <tr>
                    <th style={{ width: 50 }}>&nbsp;</th>
                    <th>Task</th>
                </tr>
            </thead>
            <tbody>
                {data.map((d: ITask) => (
                    <tr key={d._id} >
                        <td>
                            <TaskButton handleRowClick={handleRowClick} task={d}></TaskButton>
                        </td>
                        <td>
                            <Text c={d.isComplete ? 'dimmed' : ''} td={d.isComplete ? 'line-through' : ''}>{d.task}</Text>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        <Container>
            <Grid mt="md">
                <Grid.Col span={9}>
                    <TextInput {...form.getInputProps('task')} onKeyDown={handleEnter} placeholder="Task" />
                </Grid.Col>
                <Grid.Col ta='right' span={3}>
                    <Button loading={addLoading} onClick={handleAdd} sx={{ width: '100%' }} variant="gradient">Add</Button>
                </Grid.Col>
            </Grid>
        </Container>
    </>);
};

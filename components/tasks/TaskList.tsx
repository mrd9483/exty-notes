import { Badge, Button, Center, Grid, Loader, Select, Table, Text, TextInput } from '@mantine/core';
import { ITask } from '@/data/models/Task';
import { useEffect, useState } from 'react';
import { isNotEmpty, useForm } from '@mantine/form';
import { useSession } from 'next-auth/react';
import { taskService } from '@/utils/listeners';
import { TaskButton } from './TaskButton';
import TaskService from '@/services/TaskService';

type Props = {
    showComplete?: boolean,
    categories: string[],
    displayOnly?: boolean,
}

export const TaskList = (props: Props) => {

    const [data, setData] = useState<ITask[]>([]);
    const [addLoading, setAddLoading] = useState(false);
    const [dataAdded, setDataAdded] = useState('');
    const [taskLoading, setTaskLoading] = useState(false);

    const taskSvc = new TaskService();

    const { data: session, status } = useSession();

    const form = useForm({
        validateInputOnBlur: true,
        initialValues: {
            task: '',
            taskType: '',
        },
        validate: {
            task: isNotEmpty(),
        },
    });

    taskService.getData().subscribe((id) => {
        setDataAdded(id as string);
    });

    useEffect(() => {
        const runEffect = async () => {
            if (status === 'authenticated') {
                setTaskLoading(true);
                setData(await taskSvc.queryByUserId(session?.user.id as string, { showComplete: props.showComplete }));
                setTaskLoading(false);
            }
        };

        runEffect();
    }, [status, dataAdded, props.showComplete]);

    const handleAdd = async () => {
        if (!form.validate().hasErrors) {
            setAddLoading(true);

            await taskSvc.create({ user: session?.user.id as string, task: form.values.task, taskType: form.values.taskType })
                .then(() => taskSvc.queryByUserId(session?.user.id as string, { showComplete: props.showComplete })
                    .then((d) => {
                        setData(d);
                        setAddLoading(false);
                    }));

            form.reset();
        }
    };

    const handleRowClick = async (id: string) => {
        await taskSvc.setComplete(id);
        setData(await taskSvc.queryByUserId(session?.user.id as string, { showComplete: props.showComplete }));
    };

    const handleEnter = async (event: { key: string; }) => {
        if (event.key === 'Enter') {
            await handleAdd();
        }
    };

    return (<>
        {taskLoading &&
            <Center><Loader size="xl" /></Center>
        }
        <Table>
            {!props.displayOnly && (
                <thead>
                    <tr>
                        <th style={{ width: 50 }}>&nbsp;</th>
                        <th>Task</th>
                        <th>Category</th>
                    </tr>
                </thead>
            )}
            <tbody>
                {data.map((d: ITask) => (
                    <tr key={d._id} >
                        <td>
                            <TaskButton handleRowClick={handleRowClick} task={d}></TaskButton>
                        </td>
                        <td>
                            <Text c={d.isComplete ? 'dimmed' : ''} td={d.isComplete ? 'line-through' : ''}>{d.task}</Text>
                        </td>
                        <td>
                            <Badge color="green">{d.taskType}</Badge>
                        </td>
                    </tr>
                ))}
            </tbody>
        </Table>
        {!props.displayOnly && (
            <Grid mt="md">
                <Grid.Col span={6}>
                    <TextInput {...form.getInputProps('task')} onKeyDown={handleEnter} placeholder="Task" />
                </Grid.Col>
                <Grid.Col ta='right' span={3}>
                    <Select {...form.getInputProps('taskType')} data={props.categories} placeholder='Select category' />
                </Grid.Col>
                <Grid.Col ta='right' span={3}>
                    <Button loading={addLoading} onClick={handleAdd} sx={{ width: '100%' }} variant="gradient">Add</Button>
                </Grid.Col>
            </Grid>
        )}
    </>);
};

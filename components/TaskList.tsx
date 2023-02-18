import { Button, Grid, Table, TextInput, Text, ActionIcon } from '@mantine/core';
import { ITask } from '@/data/models/Task';
import { useEffect, useState } from 'react';
import { IconSquare, IconSquareCheck } from '@tabler/icons';
import { isNotEmpty, useForm } from '@mantine/form';
import { useSession } from 'next-auth/react';
import { getTasks, saveTask, setTaskComplete } from '@/services/tasks';
import moment from 'moment';
import { taskService } from '@/utils/listeners';

type Props = {
    showCompleted?: boolean
    showButtons?: boolean
};

const TaskList: React.FC<Props> = (props) => {

    const componentProps: Props = {
        showCompleted: props.showCompleted ?? true,
        showButtons: props.showButtons ?? true
    };

    const [data, setData] = useState<ITask[]>([]);
    const [addLoading, setAddLoading] = useState(false);
    const [incompletedOnly, setIncompletedOnly] = useState(true);
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
                setData(await getTasks(session?.user.id, incompletedOnly));
            }
        };

        runEffect();
    }, [status, dataAdded]);

    const handleAdd = async () => {
        if (!form.validate().hasErrors) {
            setAddLoading(true);

            await saveTask(session?.user.id as string, form.values.task)
                .then(() => getTasks(session?.user.id, incompletedOnly)
                    .then((d) => {
                        setData(d);
                        setAddLoading(false);
                    }));

            form.reset();
        }
    };

    const handleAll = async () => {
        setIncompletedOnly(false);
        setData(await getTasks(session?.user.id, incompletedOnly));
    };

    const handleRowClick = async (id: string) => {
        await setTaskComplete(id);
        setData(await getTasks(session?.user.id, incompletedOnly));
    };

    const handleEnter = async (event: { key: string; }) => {
        if (event.key === 'Enter') {
            await handleAdd();
        }
    };

    return (<Table>
        <thead>
            <tr>
                <th style={{ width: 50 }}>&nbsp;</th>
                {componentProps.showCompleted && (
                    <th style={{ width: 150, textAlign: 'right' }}>Date Completed</th>
                )}
                <th>Task</th>
            </tr>
        </thead>
        <tbody>
            {data.map((d: ITask) => (
                <tr key={d._id} >
                    <td>
                        <ActionIcon onClick={() => handleRowClick(d._id)} variant="default">
                            {d.isComplete ? <IconSquareCheck /> : <IconSquare />}
                        </ActionIcon>
                    </td>
                    {componentProps.showCompleted && (
                        <td style={{ textAlign: 'right' }}>
                            {d.dateCompleted ? moment(d.dateCompleted).format('MM/DD/YYYY') : ''}
                        </td>
                    )}
                    <td>
                        <Text c={d.isComplete ? 'dimmed' : ''} td={d.isComplete ? 'line-through' : ''}>{d.task}</Text>
                    </td>
                </tr>
            ))}
        </tbody>
        <tfoot>
            <tr>

                <th>
                    {componentProps.showButtons && (
                        <Button loading={addLoading} onClick={handleAll} sx={{ width: '100%' }} variant="gradient" gradient={{ from: 'indigo', to: 'red' }}>Show All</Button>
                    )}
                </th>
                {componentProps.showCompleted && (
                    <th>&nbsp;</th>
                )}
                <th>
                    <Grid>
                        <Grid.Col sm={componentProps.showButtons ? 10 : 12} span={componentProps.showButtons ? 8 : 12}>
                            <TextInput {...form.getInputProps('task')} onKeyDown={handleEnter} placeholder="Task" />
                        </Grid.Col>
                        {componentProps.showButtons && (
                            <Grid.Col ta='right' sm={2} span={4}>

                                <Button loading={addLoading} onClick={handleAdd} sx={{ width: '100%' }} variant="gradient" gradient={{ from: 'indigo', to: 'red' }}>Add</Button>
                            </Grid.Col>
                        )}
                    </Grid>
                </th>
            </tr>
        </tfoot>
    </Table>);
};

export default TaskList;
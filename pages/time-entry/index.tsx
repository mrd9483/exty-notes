import Layout from '@/components/Layout';
import { ITimeEntry } from '@/data/models/TimeEntry';
import { ActionIcon, Button, Container, Grid, Group, NumberInput, Select, Table, TextInput } from '@mantine/core';
import { DatePicker, DateRangePicker, DateRangePickerValue } from '@mantine/dates';
import { useEffect, useState } from 'react';
import { startOfWeek, endOfWeek, format } from 'date-fns';
import { useSession } from 'next-auth/react';
import { isInRange, isNotEmpty, useForm } from '@mantine/form';
import { IconTrash } from '@tabler/icons';
import { getEntries, saveEntry, deleteEntry } from '@/services/entries';
import { timeService } from '@/utils/listeners';

const TimeEntryIndex: React.FC = () => {
    const [datePicker, setDatePicker] = useState<DateRangePickerValue>();
    const [data, setData] = useState<ITimeEntry[]>([]);
    const [categories, setCategories] = useState(['test', 'test2']);
    const [addLoading, setAddLoading] = useState(false);
    const [dataAdded, setDataAdded] = useState('');

    const { data: session, status } = useSession();

    timeService.getData().subscribe((id) => {
        setDataAdded(id as string);
    });

    const form = useForm({
        validateInputOnBlur: true,
        initialValues: {
            date: new Date(),
            hours: 0,
            entry: '',
            category: ''
        },
        validate: {
            date: isNotEmpty(),
            category: isNotEmpty(),
            hours: isInRange({ min: 0.5, max: 24 }),
            entry: isNotEmpty()
        }
    });

    const handleLastWeekButton = async () => {
        setDatePicker([
            startOfWeek(new Date()),
            endOfWeek(new Date())
        ]);

        setData(await getEntries(session?.user.id, startOfWeek(new Date()), endOfWeek(new Date())));
    };

    const handleDatePicker = async (dates: (Date | null)[]) => {
        setDatePicker([dates[0], dates[1]]);
        if ((dates[0] && dates[1]) || (!dates[0] && !dates[1])) {
            setData(await getEntries(session?.user.id, dates[0], dates[1]));
        }
    };

    useEffect(() => {
        const runEffect = async () => {
            console.log(status);
            if (status === 'authenticated') {
                setData(await getEntries(session?.user.id));
            }
        };

        runEffect();
    }, [status, dataAdded]);

    const handleAdd = async () => {
        if (!form.validate().hasErrors) {

            setAddLoading(true);

            await saveEntry(session?.user.id as string, form.values.date, form.values.entry, form.values.hours, form.values.category)
                .then(() => getEntries(session?.user.id, datePicker?.[0], datePicker?.[1])
                    .then((d) => {
                        setData(d);
                        setAddLoading(false);
                    }));

            form.reset();
        }
    };

    const handleDeleteEntry = async (_id: string) => {
        deleteEntry(_id)
            .then(() => getEntries(session?.user.id, datePicker?.[0], datePicker?.[1])
                .then((d) => {
                    setData(d);
                }));
    };

    return (
        <Layout menu={<></>}>
            <Container size="lg" px="xs">
                <Grid>
                    <Grid.Col sm={10} span={8}>
                        <DateRangePicker mb="md" placeholder='Pick date range' value={datePicker} onChange={handleDatePicker} firstDayOfWeek='sunday' />
                    </Grid.Col>
                    <Grid.Col sm={2} span={4}>
                        <Button sx={{ width: '100%' }} variant="outline" onClick={handleLastWeekButton}>Current Week</Button>
                    </Grid.Col>
                </Grid>
                <Table withBorder withColumnBorders>
                    <thead>
                        <tr>
                            <th style={{ width: 150 }}>Date</th>
                            <th style={{ width: 100 }}>Hours</th>
                            <th style={{ width: 200 }}>Category</th>
                            <th>Entry</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((d: ITimeEntry) => (
                            <tr key={d._id}>
                                <td>{format(new Date(d.date), 'MM/dd/yyyy')}</td>
                                <td>{d.hours}</td>
                                <td>{d.category}</td>
                                <td>
                                    <Group position='apart'>
                                        {d.entry}
                                        <ActionIcon size="md" onClick={() => handleDeleteEntry(d._id)}>
                                            <IconTrash size={14} />
                                        </ActionIcon>
                                    </Group>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th><DatePicker clearable={false} {...form.getInputProps('date')} withinPortal placeholder="Pick date" inputFormat="MM/DD/YYYY" /></th>
                            <th><NumberInput {...form.getInputProps('hours')} precision={2} step={0.5} min={0} max={24} placeholder="Hours" /></th>
                            <th>
                                <Select
                                    {...form.getInputProps('category')}
                                    getCreateLabel={(query) => `+ ${query}`}
                                    searchable
                                    creatable
                                    data={categories}
                                    onCreate={(query) => {
                                        setCategories((category) => [...category, query]);
                                        return query;
                                    }}
                                /></th>
                            <th>
                                <Grid>
                                    <Grid.Col sm={10} span={8}>
                                        <TextInput {...form.getInputProps('entry')} placeholder="Entry" />
                                    </Grid.Col>
                                    <Grid.Col ta='right' sm={2} span={4}>
                                        <Button loading={addLoading} onClick={handleAdd} sx={{ width: '100%' }} variant="gradient">Add</Button>
                                    </Grid.Col>
                                </Grid>
                            </th>
                        </tr>
                    </tfoot>
                </Table>
            </Container>
        </Layout>
    );
};

export default TimeEntryIndex;

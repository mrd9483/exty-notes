import Layout from '@/components/Layout';
import { ITimeEntry } from '@/data/models/TimeEntry';
import { ActionIcon, Button, Container, Grid, Group, NumberInput, Table, TextInput } from '@mantine/core';
import { DatePicker, DateRangePicker, DateRangePickerValue } from '@mantine/dates';
import { useEffect, useState } from 'react';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { useSession } from 'next-auth/react';
import { isInRange, isNotEmpty, useForm } from '@mantine/form';
import { IconTrash } from '@tabler/icons';
import { ITimeEntryReport, deleteEntry, entryReport, getEntries, saveEntry } from '@/services/entries';
import { timeService } from '@/utils/listeners';
import TimeEntryReport from '@/components/TimeEntryReport';

const TimeEntryIndex: React.FC = () => {
    const [datePicker, setDatePicker] = useState<DateRangePickerValue>();
    const [data, setData] = useState<ITimeEntry[]>([]);
    const [addLoading, setAddLoading] = useState(false);
    const [dataAdded, setDataAdded] = useState('');
    const [dataReport, setDataReport] = useState<ITimeEntryReport[]>([]);

    const { data: session, status } = useSession();

    timeService.getData().subscribe((id) => {
        setDataAdded(id as string);
    });

    const form = useForm({
        initialValues: {
            date: new Date(),
            hours: 0,
            entry: '',
        },
        validate: {
            date: isNotEmpty(),
            hours: isInRange({ min: 0.5, max: 24 }),
            entry: isNotEmpty()
        }
    });

    const handleLastWeekButton = async () => {
        const start = startOfWeek(new Date());
        const end = endOfWeek(new Date());
        setDatePicker([
            start,
            end
        ]);

        getEntriesUI(start, end);
    };

    const handleDatePicker = async (dates: (Date | null)[]) => {
        setDatePicker([dates[0], dates[1]]);
        if ((dates[0] && dates[1]) || (!dates[0] && !dates[1])) {
            getEntriesUI(dates[0], dates[1]);
        }
    };

    const getEntriesUI = (...params: (Date | null | undefined)[]) => {
        getEntries(session?.user.id, params?.[0], params?.[1])
            .then((d) => {
                setData(d);
                setDataReport(entryReport(d));
            });
    };

    useEffect(() => {
        const runEffect = async () => {
            if (status === 'authenticated') {
                await handleLastWeekButton();
            }
        };

        runEffect();

    }, [status, dataAdded]);

    const handleAdd = async () => {
        if (!form.validate().hasErrors) {

            setAddLoading(true);

            await saveEntry(session?.user.id as string, form.values.date, form.values.entry, form.values.hours)
                .then(() => {
                    getEntriesUI(datePicker?.[0], datePicker?.[1]);
                    setAddLoading(false);
                });

            form.reset();
        }
    };

    const handleDeleteEntry = async (_id: string) => {
        deleteEntry(_id)
            .then(() => getEntriesUI(datePicker?.[0], datePicker?.[1]));
    };

    return (
        <Layout menu={<TimeEntryReport report={dataReport} />}>
            <Container size="lg" px="xs">
                <Grid>
                    <Grid.Col span='auto'>
                        <DateRangePicker mb="md" placeholder='Pick date range' value={datePicker} onChange={handleDatePicker} firstDayOfWeek='sunday' />
                    </Grid.Col>
                    <Grid.Col md={2} sm={3} span={5}>
                        <Button sx={{ width: '100%' }} variant="subtle" onClick={handleLastWeekButton}>Current Week</Button>
                    </Grid.Col>
                </Grid>
                <Table withBorder withColumnBorders style={{ 'background': '#fff' }}>
                    <thead>
                        <tr>
                            <th style={{ width: 125 }}>Date</th>
                            <th style={{ width: 100 }}>Hours</th>
                            <th>Entry</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((d: ITimeEntry) => (
                            <tr key={d._id}>
                                <td>{format(new Date(d.date), 'MM/dd/yyyy')}</td>
                                <td>{d.hours}</td>
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
                        <tr>
                            <td>
                                <DatePicker clearable={false} {...form.getInputProps('date')} withinPortal placeholder="Pick date" inputFormat="MM/DD/YYYY" />
                            </td>
                            <td>
                                <NumberInput {...form.getInputProps('hours')} precision={2} step={0.5} min={0} max={24} placeholder="Hours" />
                            </td>
                            <td>
                                <Grid>
                                    <Grid.Col span='auto'>
                                        <TextInput {...form.getInputProps('entry')} placeholder="Entry" />
                                    </Grid.Col>
                                    <Grid.Col span={2}>
                                        <Button loading={addLoading} sx={{ width: '100%' }} onClick={handleAdd} variant="gradient">Add</Button>
                                    </Grid.Col>
                                </Grid>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        </Layout>
    );
};

export default TimeEntryIndex;

import Layout from '@/components/layouts/Layout';
import { ITimeEntry } from '@/data/models/TimeEntry';
import { ActionIcon, Button, Container, Grid, NumberInput, Table, TextInput } from '@mantine/core';
import { DatePicker, DateRangePicker, DateRangePickerValue } from '@mantine/dates';
import { useEffect, useRef, useState } from 'react';
import { endOfWeek, format, startOfWeek } from 'date-fns';
import { useSession } from 'next-auth/react';
import { isInRange, isNotEmpty, useForm } from '@mantine/form';
import { IconSquareRoundedPlus, IconTrash } from '@tabler/icons';
import { ITimeEntryReport, deleteEntry, entryReport, getEntries, saveEntry } from '@/services/entries';
import { timeService } from '@/utils/listeners';
import TimeEntryReport from '@/components/timeEntries/TimeEntryReport';

const TimeEntryIndex: React.FC = () => {
    const [datePicker, setDatePicker] = useState<DateRangePickerValue>();
    const [data, setData] = useState<ITimeEntry[]>([]);
    const [addLoading, setAddLoading] = useState(false);
    const [dataAdded, setDataAdded] = useState('');
    const [dataReport, setDataReport] = useState<ITimeEntryReport[]>([]);
    
    const textinput = useRef<HTMLInputElement>(null);
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
                    textinput.current?.focus();
                });

            form.reset();
        }
    };

    const handleEnter = async (event: { key: string; }) => {
        if (event.key === 'Enter') {
            await handleAdd();
        }
    };

    const handleDeleteEntry = async (_id: string) => {
        deleteEntry(_id)
            .then(() => getEntriesUI(datePicker?.[0], datePicker?.[1]));
    };

    return (
        <Layout menu={<TimeEntryReport report={dataReport} />}>
            <Container size="md" px="xs">
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
                            <th>Entry</th>
                            <th style={{ width: 100 }}>Hours</th>
                            <th style={{ width: 125 }}>Date</th>
                            <th style={{ width: 50 }}>&nbsp;</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((d: ITimeEntry) => (
                            <tr key={d._id}>
                                <td>
                                    {d.entry}
                                </td>
                                <td>{d.hours}</td>
                                <td>{format(new Date(d.date), 'MM/dd/yyyy')}</td>
                                <td>
                                    <ActionIcon size="md" variant='subtle' onClick={() => handleDeleteEntry(d._id)}>
                                        <IconTrash size={14} />
                                    </ActionIcon>
                                </td>
                            </tr>
                        ))}
                        <tr>
                            <td>
                                <TextInput onKeyDown={handleEnter} ref={textinput} {...form.getInputProps('entry')} placeholder="Entry" />
                            </td>
                            <td>
                                <NumberInput onKeyDown={handleEnter} {...form.getInputProps('hours')} precision={2} step={0.5} min={0} max={24} placeholder="Hours" />
                            </td>
                            <td>
                                <DatePicker onKeyDown={handleEnter} clearable={false} {...form.getInputProps('date')} withinPortal placeholder="Pick date" inputFormat="MM/DD/YYYY" />
                            </td>
                            <td>
                                <ActionIcon variant='gradient' size="md" loading={addLoading} onClick={handleAdd}>
                                    <IconSquareRoundedPlus size={16} />
                                </ActionIcon>
                            </td>
                        </tr>
                    </tbody>
                </Table>
            </Container>
        </Layout>
    );
};

export default TimeEntryIndex;

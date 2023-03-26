import { Layout } from '@/components/layouts/Layout';
import { ITimeEntry } from '@/data/models/TimeEntry';
import { ActionIcon, Button, Container, Divider, Grid, Group, NumberInput, TextInput } from '@mantine/core';
import { DatePicker, DateRangePicker, DateRangePickerValue } from '@mantine/dates';
import { useEffect, useRef, useState } from 'react';
import { endOfWeek, startOfWeek } from 'date-fns';
import { useSession } from 'next-auth/react';
import { isInRange, isNotEmpty, useForm } from '@mantine/form';
import { IconList, IconListDetails, IconSquareRoundedPlus } from '@tabler/icons';
import EntryService, { ITimeEntryReport } from '@/services/EntryService';
import { timeService } from '@/utils/listeners';
import { TimeEntryReport } from '@/components/timeEntries/TimeEntryReport';
import { Dictionary } from 'lodash';
import { NestedTable } from '@/components/timeEntries/NestedTable';
import { CollapsedTable } from '@/components/timeEntries/CollapsedTable';

type Props = {
    lastDate: string
}

const TimeEntryIndex = (props: Props) => {
    console.log(props.lastDate);

    const [datePicker, setDatePicker] = useState<DateRangePickerValue>();
    const [data, setData] = useState<Dictionary<ITimeEntry[]>>({});
    const [addLoading, setAddLoading] = useState(false);
    const [dataAdded, setDataAdded] = useState('');
    const [dataReport, setDataReport] = useState<ITimeEntryReport[]>([]);
    const [collapsed, setCollapsed] = useState(false);

    const textinput = useRef<HTMLInputElement>(null);
    const { data: session, status } = useSession();
    const entryService = new EntryService();

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
            entry: isNotEmpty(),
        },
    });

    const handleLastWeekButton = async () => {
        const start = startOfWeek(new Date());
        const end = endOfWeek(new Date());
        setDatePicker([
            start,
            end,
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
        entryService.getEntries(session?.user.id as string, params?.[0], params?.[1])
            .then((d) => {
                setData(EntryService.entryGroup(d));
                setDataReport(EntryService.entryReport(d));
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

            await entryService.create({
                user: session?.user.id as string,
                date: form.values.date,
                entry: form.values.entry,
                hours: form.values.hours,
            })
                .then(() => {
                    getEntriesUI(datePicker?.[0], datePicker?.[1]);
                    setAddLoading(false);
                    textinput.current?.focus();
                }).then();

            const prevDate = form.values.date;
            form.reset();
            form.setFieldValue('date', prevDate);
        }
    };

    const handleEnter = async (event: { key: string; stopPropagation: () => void; }) => {
        if (event.key === 'Enter') {
            event.stopPropagation();
            await handleAdd();

        }
    };

    const handleDeleteEntry = async (_id: string) => {
        entryService.delete(_id)
            .then(() => getEntriesUI(datePicker?.[0], datePicker?.[1]));
    };

    return (
        <Layout menu={<TimeEntryReport report={dataReport} />}>
            <Container size="md" px="xs">
                <Grid mt='md'>
                    <Grid.Col sm='auto' span={9}>
                        <TextInput onKeyDown={handleEnter} ref={textinput} {...form.getInputProps('entry')} placeholder="Entry" />
                    </Grid.Col>
                    <Grid.Col sm={1} span={3}>
                        <NumberInput hideControls onKeyDown={handleEnter} {...form.getInputProps('hours')} precision={2} step={0.5} min={0} max={24} placeholder="Hours" />
                    </Grid.Col>
                    <Grid.Col sm={2} span={9}>
                        <DatePicker onKeyDown={handleEnter} clearable={false} {...form.getInputProps('date')} withinPortal placeholder="Pick date" firstDayOfWeek='sunday' inputFormat="MM/DD/YYYY" />
                    </Grid.Col>
                    <Grid.Col sm={1} span={3}>
                        <ActionIcon sx={{ width: '100%', height: '36px' }} variant='gradient' loading={addLoading} onClick={handleAdd}>
                            <IconSquareRoundedPlus size={20} />
                        </ActionIcon>
                    </Grid.Col>
                </Grid>
                <Divider my="sm" variant="dotted" />
                <Grid>
                    <Grid.Col span='auto'>
                        <DateRangePicker mb="md" placeholder='Pick date range' value={datePicker} onChange={handleDatePicker} firstDayOfWeek='sunday' />
                    </Grid.Col>
                    <Grid.Col md={4} sm={5} span={6}>
                        <Group position='right'>
                            <ActionIcon variant={collapsed ? 'filled' : 'outline'} color='yellow' onClick={() => setCollapsed(true)}>
                                <IconList size={16} />
                            </ActionIcon>
                            <ActionIcon variant={!collapsed ? 'filled' : 'outline'} color='cyan' onClick={() => setCollapsed(false)}>
                                <IconListDetails size={16} />
                            </ActionIcon>
                            <Button variant="subtle" onClick={handleLastWeekButton}>Current Week</Button>
                        </Group>
                    </Grid.Col>
                </Grid>
                {collapsed && <CollapsedTable data={data} handleDeleteEntry={handleDeleteEntry} />}
                {!collapsed && <NestedTable data={data} handleDeleteEntry={handleDeleteEntry} />}
            </Container>
        </Layout >
    );
};

export default TimeEntryIndex;

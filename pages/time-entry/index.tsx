import Layout from '@/components/Layout';
import { ITimeEntry } from '@/data/models/TimeEntry';
import { Button, Container, Grid, Input, NumberInput, Table } from '@mantine/core';
import { DatePicker, DateRangePicker, DateRangePickerValue } from '@mantine/dates';
import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { format } from 'date-fns';

const getData = async () => {
    return await fetch('http://localhost:3000/api/timeEntries/user/63d559fbd82fcc2c546416e2').then(res => res.json());
};

type Props = {
    initialData: Array<ITimeEntry>
}

export const getServerSideProps: GetServerSideProps = async () => {
    return { props: { initialData: await getData() } };
};

const TimeEntryIndex: React.FC<Props> = (props) => {
    const [value, setValue] = useState<DateRangePickerValue>([
        new Date(2021, 11, 1),
        new Date(2021, 11, 5),
    ]);

    const [data, setData] = useState<ITimeEntry[]>(props.initialData);

    return (
        <Layout menu={<></>}>
            <Container size="lg" px="xs">
                <DateRangePicker mb="md" label='Entry Range' placeholder='Pick dates range' value={value} onChange={setValue} firstDayOfWeek='sunday' />
                <Table withBorder withColumnBorders>
                    <thead>
                        <tr>
                            <th style={{ width: 150 }}>Date</th>
                            <th style={{ width: 100 }}>Hours</th>
                            <th>Entry</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((d: ITimeEntry) => (
                            <tr key={d._id}>
                                <td>{format(new Date(d.date), 'MM/dd/yyyy')}</td>
                                <td>{d.hours}</td>
                                <td>{d.entry}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <th><DatePicker withinPortal placeholder="Pick date" inputFormat="MM/DD/YYYY" /></th>
                            <th><NumberInput precision={2} step={0.5} placeholder="Hours" /></th>
                            <th><Grid>
                                <Grid.Col sm={10} span={8}>
                                    <Input sx={{ width: '100%' }} placeholder="Entry" />
                                </Grid.Col>
                                <Grid.Col ta='right' sm={2} span={4}>
                                    <Button sx={{ width: '100%' }} variant="gradient" gradient={{ from: 'indigo', to: 'red' }}>Add</Button>
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

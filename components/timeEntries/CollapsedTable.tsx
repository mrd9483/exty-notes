import { ITimeEntry } from '@/data/models/TimeEntry';
import { ActionIcon, Table } from '@mantine/core';
import { IconTrash } from '@tabler/icons';
import { format } from 'date-fns';
import { Dictionary } from 'lodash';

type Props = {
    handleDeleteEntry: (_id: string) => Promise<void>;
    data: Dictionary<ITimeEntry[]>;
}
export const CollapsedTable = (props: Props) => {
    return (
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
                {Object.keys(props.data).map((idx: string) => (
                    props.data[idx].map((d: ITimeEntry) => (
                        <tr key={d._id}>
                            <td>
                                {d.entry}
                            </td>
                            <td>{d.hours}</td>
                            <td>{format(new Date(d.date), 'MM/dd/yyyy')}</td>
                            <td>
                                <ActionIcon size="md" variant='subtle' onClick={() => props.handleDeleteEntry(d._id)}>
                                    <IconTrash size={14} />
                                </ActionIcon>
                            </td>
                        </tr>
                    ))
                ))}

            </tbody>
        </Table>
    );
};

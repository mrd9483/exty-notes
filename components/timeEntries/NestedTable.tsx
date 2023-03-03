import { ITimeEntry } from '@/data/models/TimeEntry';
import { Accordion, ActionIcon, Table, createStyles } from '@mantine/core';
import { IconTrash } from '@tabler/icons';
import { format } from 'date-fns';
import { Dictionary } from 'lodash';

type Props = {
    handleDeleteEntry: (_id: string) => Promise<void>;
    data: Dictionary<ITimeEntry[]>;
}

export const NestedTable = (props: Props) => {
    const useStyles = createStyles((theme) => ({
        root: {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            borderRadius: theme.radius.sm,
        },
        item: {
            backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
            border: '1px solid transparent',
            position: 'relative',
            zIndex: 0,
            transition: 'transform 150ms ease',

            '&[data-active]': {
                transform: 'scale(1.03)',
                backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
                boxShadow: theme.shadows.md,
                borderColor: theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],
                borderRadius: theme.radius.md,
                zIndex: 1,
            },
        },
        chevron: {
            '&[data-rotate]': {
                transform: 'rotate(-90deg)',
            },
        },
    }));

    const { classes } = useStyles();

    return (
        <Accordion variant="separated" radius="md" classNames={classes} defaultValue={format(new Date(), 'yyyy-MM-dd')} className={classes.root}>
            {Object.keys(props.data).map((idx: string) => (
                <Accordion.Item key={idx} value={idx}>
                    <Accordion.Control >
                        <strong>{idx}</strong>
                    </Accordion.Control>
                    <Accordion.Panel>
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
                                {props.data[idx].map((d: ITimeEntry) => (
                                    <tr key={d._id}>
                                        <td>{d.entry}</td>
                                        <td>{d.hours}</td>
                                        <td>{format(new Date(d.date), 'MM/dd/yyyy')}</td>
                                        <td>
                                            <ActionIcon size="md" variant='subtle' onClick={() => props.handleDeleteEntry(d._id)}>
                                                <IconTrash size={14} />
                                            </ActionIcon>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Accordion.Panel>
                </Accordion.Item>
            ))}
        </Accordion>
    );
};

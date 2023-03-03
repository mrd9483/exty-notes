import { ITimeEntryReport } from '@/services/entries';
import { Box, MediaQuery, Navbar, Table } from '@mantine/core';
import _ from 'lodash';

type Props = {
    report: ITimeEntryReport[]
};

export const TimeEntryReport = (props: Props) => {

    return (
        <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
            <Navbar fixed={true} width={{ base: 0, sm: 200 }}>
                <Box>
                    <Table>
                        <tbody>
                            {props.report.map((r: ITimeEntryReport) => (
                                <tr key={r.date}>
                                    <td style={{ width: 120 }}><strong>{r.date}</strong></td>
                                    <td style={{ textAlign: 'right' }}>{r.sum}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <th>TOTAL</th>
                                <th style={{ textAlign: 'right' }}>{_.sumBy(props.report, 'sum')}</th>
                            </tr>
                        </tfoot>
                    </Table>
                </Box>
            </Navbar>
        </MediaQuery>
    );
};

import { ITimeEntryReport } from '@/services/entries';
import { Box, Navbar, Table } from '@mantine/core';
import _ from 'lodash';

type Props = {
    report: ITimeEntryReport[]
};

const TimeEntryReport: React.FC<Props> = (props) => {

    return (
        <Navbar fixed={true} width={{ base: 200 }}>
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
    );

};

export default TimeEntryReport;

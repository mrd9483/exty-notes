import { Navbar, Box, NavLink } from '@mantine/core';
import { ReactNode } from 'react';
import Layout from './Layout';
import { INoteTitleOnly } from '@/data/models/Note';
import _ from 'lodash';

type NoteProps = {
    children: ReactNode;
    notes: INoteTitleOnly[];
};

const NoteLayout: React.FC<NoteProps> = (props) => {
    return (
        <Layout menu={
            <Navbar fixed={true} width={{ base: 300 }}>
                <Box>
                    {props.notes.map((n) => (
                        <NavLink key={n._id} label={_.truncate(n.title, { length: 30 })} component='a' href={`/notes/${n._id}`} />
                    ))}
                </Box>
            </Navbar>}
        >
            {props.children}
        </Layout>
    );
};

export default NoteLayout;

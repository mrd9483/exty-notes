import { Box, MediaQuery, NavLink, Navbar } from '@mantine/core';
import { ReactNode } from 'react';
import { Layout } from './Layout';
import { INoteTitleOnly } from '@/data/models/Note';
import _ from 'lodash';
import Link from 'next/link';

type NoteProps = {
    children: ReactNode;
    notes: INoteTitleOnly[];
};

export const NoteLayout = (props: NoteProps) => {
    return (
        <Layout menu={
            <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                <Navbar fixed={true} width={{ base: 0, sm: 300}}>
                    <Box>
                        {props.notes.map((n) => (
                            <NavLink key={n._id} label={_.truncate(n.title, { length: 30 })} component={Link} href={`/notes/${n._id}`} />
                        ))}
                    </Box>
                </Navbar>
            </MediaQuery>
        }
        >
            {props.children}
        </Layout>
    );
};

import { Navbar, Box, NavLink } from '@mantine/core';
import { ReactNode } from 'react';
import Layout from './Layout';
import { INavigation } from '@/data/models/Navigation';

type NoteProps = {
    children: ReactNode;
    navigation: INavigation;
};

const NoteLayout: React.FC<NoteProps> = (props) => {
    return (
        <Layout menu={
            <Navbar fixed={true} width={{ base: 300 }}>
                <Box>
                    {props.navigation.notes.map((n) => (
                        <NavLink key={n.note.toString()} label={n.title} component='a' href={`/notes/${n.note}`} />
                    ))}
                </Box>
            </Navbar>}
        >
            {props.children}
        </Layout>
    );
};

export default NoteLayout;

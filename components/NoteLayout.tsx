import { AppShell, Navbar, Header, Box, NavLink, Title } from '@mantine/core';
import { ReactNode } from 'react';
import { NextRouter, useRouter } from 'next/router';
import Layout from './Layout';

const navigationBuilder = (router: NextRouter | string[], navigation: Array<JSON>) => {
    if (navigation.length === 0)
        return null;

    const eventAlert = (id: string, e: any) => {
        if (e.target.classList.contains('mantine-NavLink-label')) {
            router.push('a');
            //alert('you are clicking the label, great job!');
            console.log(id);
        }
    };

    return (
        <>
            {navigation.map((n: any) => (
                <NavLink
                    key={n._id} label={n.title} onClick={(e) => { eventAlert(n.note, e); }}>
                    {navigationBuilder(router, n.navigation)}
                </NavLink>
            ))}
        </>
    );
};

type NoteProps = {
    children: ReactNode;
    navigation: Array<JSON>;
};

const NoteLayout: React.FC<NoteProps> = (props) => {
    const router = useRouter();

    return (
        <Layout menu={
            <Navbar fixed={true} width={{ base: 300 }}>
                <Box>
                    {navigationBuilder(router, props.navigation as Array<JSON>)}
                </Box>
            </Navbar>}
        >
            {props.children}
        </Layout >
    );
};

export default NoteLayout;

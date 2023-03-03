import { ReactNode } from 'react';
import { Layout } from './Layout';

type NoteProps = {
    children: ReactNode;
};

export const NoNoteLayout = (props: NoteProps) => {
    return (
        <Layout menu={<></>}>
            {props.children}
        </Layout>
    );
};

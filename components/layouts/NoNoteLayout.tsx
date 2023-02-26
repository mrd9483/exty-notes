import { ReactNode } from 'react';
import Layout from './Layout';

type NoteProps = {
    children: ReactNode;
};

const NoNoteLayout: React.FC<NoteProps> = (props) => {
    return (
        <Layout menu={<></>}>
            {props.children}
        </Layout>
    );
};

export default NoNoteLayout;

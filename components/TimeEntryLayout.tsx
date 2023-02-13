import { ReactNode } from 'react';
import Layout from './Layout';
import { INavigation } from '@/data/models/Navigation';

type NoteProps = {
    children: ReactNode;
    navigation: INavigation;
};

const TimeEntryLayout: React.FC<NoteProps> = (props) => {
    return (
        <Layout menu={<></>}>
            {props.children}
        </Layout>
    );
};

export default TimeEntryLayout;

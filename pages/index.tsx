import Layout from '@/components/Layout';
import { Container } from '@mantine/core';
import CommandLine from '@/components/CommandLine';

const Home: React.FC = () => {

    return (
        <Layout menu={<></>}>
            <Container size="lg" px="xs">
                <CommandLine onEnter={() => alert('test')} />
            </Container>
        </Layout>
    );
};

export default Home;

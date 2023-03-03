import { CommandLine } from '@/components/commandLine/CommandLine';
import { Layout } from '@/components/layouts/Layout';
import { Container } from '@mantine/core';

const Home = () => {

    return (
        <Layout menu={<></>}>
            <Container size="lg" px="xs">
                <CommandLine onEnter={() => alert('test')} />
            </Container>
        </Layout>
    );
};

export default Home;

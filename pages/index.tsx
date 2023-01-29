import Layout from '@/components/Layout';
import { Button, Container, Input } from '@mantine/core';
import { useForm } from '@mantine/form';

const Home: React.FC = () => {

    const form = useForm({
        initialValues: {
            title: '',
        },
    });

    const addNote = async () => {
        const resNavigation = await fetch('http://localhost:3000/api/notes', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user: '63c8beac4d9af39b11524d02',
                title: form.getInputProps('title').value
            })
        }).then(res => res.json());
    };

    return (
        <Layout menu={<></>}>
            <Container size="lg" px="xs">
                <Input {...form.getInputProps('title')} placeholder="Title" radius="md" mb="md" />
                <Button variant="gradient" onClick={addNote} gradient={{ from: 'indigo', to: 'red' }}>Create Note</Button>
            </Container>
        </Layout>
    );
};

export default Home;

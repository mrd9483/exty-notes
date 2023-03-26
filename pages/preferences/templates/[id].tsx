import { Box, Container, Input, ThemeIcon, validateJson } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { useForm } from '@mantine/form';
import { useDebounce } from 'use-debounce';
import { useEffect, useRef, useState } from 'react';
import { IconDeviceFloppy } from '@tabler/icons';
import { TextEditor } from '@/components/shared/TextEditor';
import { getTemplate, updateTemplate } from '@/services/templates';
import { ITemplate } from '@/data/models/Template';
import getEditor from '@/utils/editor';
import { NoNoteLayout } from '@/components/layouts/NoNoteLayout';
import { useSession } from 'next-auth/react';

export const getServerSideProps: GetServerSideProps = async (context) => {

    const { id } = context.query;

    return {
        props: {
            template: await getTemplate(id as string),
        },
    };
};

type Props = {
    template: ITemplate;
}

const Template = (props: Props) => {
    const loaded = useRef(false);
    const contentJson = (props.template.template !== '' && validateJson(props.template.template)) ? props.template.template : '[]';
    const { data: session } = useSession();

    const content = {
        type: 'doc',
        content: JSON.parse(contentJson),
    };

    const editor = getEditor(content);

    const form = useForm({
        initialValues: {
            shortcut: props.template.shortcut,
            template: props.template.template,
        },
    });

    const templateId = props.template._id;

    const [debouncedEditor] = useDebounce(editor?.state.doc.content, 2000, { maxWait: 15000 });
    const [debouncedShortcut] = useDebounce(form?.values.shortcut, 2000, { maxWait: 15000 });
    const [saveIndicator, setSaveIndicator] = useState(false);

    useEffect(() => {
        if (!debouncedEditor)
            return;

        if (loaded.current) {
            setSaveIndicator(true);
            updateTemplate(templateId as string, session?.user.id as string, JSON.stringify(debouncedEditor.toJSON()), form.values.shortcut)
                .then(() => { setSaveIndicator(false); });
        } else {
            loaded.current = true;
        }

    }, [debouncedEditor, debouncedShortcut]);

    return (
        <NoNoteLayout>
            <Container size="lg" px="xs">
                <Box>
                    <Input variant="unstyled" {...form.getInputProps('shortcut')} placeholder="Shortcut" mb="xl" styles={() => ({ input: { height: '35px', borderBottom: '1px solid', fontWeight: 'bold' } })} radius="xs" size="xl" />
                </Box>
                <TextEditor editor={editor} />
            </Container>
            <Box sx={{ position: 'absolute', bottom: '20px', right: '20px' }}>
                <ThemeIcon hidden={!saveIndicator} radius="xl" size="xl" color="dark">
                    <IconDeviceFloppy />
                </ThemeIcon>
            </Box>
        </NoNoteLayout>
    );
};

export default Template;

import { NoteLayout } from '@/components/layouts/NoteLayout';
import { Box, Container, Group, Input, MediaQuery, Text, ThemeIcon, validateJson } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { INote, INoteTitleOnly } from '@/data/models/Note';
import { useForm } from '@mantine/form';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { useDebounce } from 'use-debounce';
import { useEffect, useRef, useState } from 'react';
import { getNote, getNotesByUserId, saveContent } from '../../services/notes';
import { IconDeviceFloppy } from '@tabler/icons';

import mongoose from 'mongoose';

import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { useSession } from 'next-auth/react';
import { TextEditor } from '@/components/shared/TextEditor';
import getEditor from '@/utils/editor';
import { templateService } from '@/utils/listeners';
import { getTemplateByShortcut } from '@/services/templates';


export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);

    const { id } = context.query;

    return {
        props: {
            notesTitleOnly: await getNotesByUserId(session?.user.id as string, true),
            note: await getNote(id as string)
        }
    };
};

type Props = {
    notesTitleOnly: INoteTitleOnly[];
    note: INote;
}

const Page = (props: Props) => {
    const loaded = useRef(false);
    const contentJson = (props.note.note !== '' && validateJson(props.note.note)) ? props.note.note : '[]';

    const content = {
        type: 'doc',
        content: JSON.parse(contentJson)
    };

    const editor = getEditor(content);

    const form = useForm({
        initialValues: {
            title: props.note.title,
            note: props.note.note
        }
    });

    templateService.getData().subscribe({
        next: (shortcut) => getTemplateByShortcut(session?.user.id as string, shortcut as string)
            .then(res => editor?.chain().focus().insertContent(res.template))
    });

    const noteId = props.note._id;
    const [debouncedEditor] = useDebounce(editor?.state.doc.content, 2000, { maxWait: 15000 });
    const [debouncedTitle] = useDebounce(form?.values.title, 2000, { maxWait: 15000 });
    const [saveIndicator, setSaveIndicator] = useState(false);
    const [modified, setModified] = useState(new Date());
    const [modifiedHuman, setModifiedHuman] = useState('');
    const [notesTitleOnly, setNotesTitleOnly] = useState<INoteTitleOnly[]>(props.notesTitleOnly);
    const { data: session } = useSession();

    useEffect(() => {
        if (!debouncedEditor)
            return;

        if (loaded.current) {
            setSaveIndicator(true);
            saveContent(noteId, JSON.stringify(debouncedEditor.toJSON()), form.values.title)
                .then((res) => {
                    setSaveIndicator(false);
                    setModified(new Date(res.updated));
                });

        } else {
            loaded.current = true;
        }

    }, [debouncedEditor]);

    useEffect(() => {
        if (!debouncedEditor)
            return;

        setSaveIndicator(true);
        saveContent(noteId, JSON.stringify(debouncedEditor.toJSON()), form.values.title)
            .then((res) => {
                setSaveIndicator(false);
                setModified(new Date(res.updated));

                getNotesByUserId(session?.user.id as string, true).then(data => {
                    setNotesTitleOnly(data);
                });
            });
    }, [debouncedTitle]);

    useEffect(() => {
        const interval = setInterval(() => {
            setModifiedHuman(formatDistanceToNow(modified, { includeSeconds: true }));
        }, 1000);
        return () => clearInterval(interval);
    }, [modified]);

    return (
        <NoteLayout notes={notesTitleOnly}>
            <Container size="lg" px="xs">
                <Box>
                    <Input variant="unstyled" {...form.getInputProps('title')} placeholder="Title" mb="xl" styles={() => ({ input: { height: '35px', borderBottom: '1px solid', fontWeight: 'bold' } })} radius="xs" size="xl" />
                </Box>
                <MediaQuery smallerThan="sm" styles={{ display: 'none' }}>
                    <Group position='apart'>
                        <Text c="dimmed">Created {formatDistanceToNow(new mongoose.Types.ObjectId(props.note._id).getTimestamp())} ago</Text>
                        <Text c="dimmed">Modified {modifiedHuman} ago</Text>
                    </Group>
                </MediaQuery>
                <TextEditor editor={editor} />
            </Container>
            <Box sx={{ position: 'absolute', bottom: '20px', right: '20px' }}>
                <ThemeIcon hidden={!saveIndicator} radius="xl" size="xl" color="dark">
                    <IconDeviceFloppy />
                </ThemeIcon>
            </Box>
        </NoteLayout>
    );
};

export default Page;

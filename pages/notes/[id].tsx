import NoteLayout from '@/components/NoteLayout';
import { RichTextEditor, Link } from '@mantine/tiptap';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Input, Text, Container, Grid, ThemeIcon, validateJson, Group } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { INote, INoteTitleOnly } from '@/data/models/Note';
import { useForm } from '@mantine/form';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { useDebounce } from 'use-debounce';
import { useEffect, useRef, useState } from 'react';
import { getNote, getNotesByUserId, saveContent } from '../../services/notes';
import { IconColumnInsertLeft, IconColumnInsertRight, IconDeviceFloppy, IconRowInsertBottom, IconRowInsertTop, IconTable, IconTableOff, IconClockHour8 } from '@tabler/icons';

import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { RiDeleteColumn, RiDeleteRow } from 'react-icons/ri';
import mongoose from 'mongoose';

import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import format from 'date-fns/format';


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

const Page: React.FC<Props> = (props) => {
    const loaded = useRef(false);
    const contentJson = (props.note.note !== '' && validateJson(props.note.note)) ? props.note.note : '[]';

    const content = {
        type: 'doc',
        content: JSON.parse(contentJson)
    };

    const editor = useEditor({
        extensions: [
            StarterKit,
            Link,
            Underline,
            Table.configure({ resizable: true }),
            TableCell,
            TableHeader,
            TableRow,
            TaskList,
            TaskItem
        ],
        content
    });

    const [noteId,] = useState(props.note._id);
    const [debouncedEditor] = useDebounce(editor?.state.doc.content, 2000, { maxWait: 15000 });
    const [saveIndicator, setSaveIndicator] = useState(false);
    const [modified, setModified] = useState(new Date());
    const [modifiedHuman, setModifiedHuman] = useState('');

    const form = useForm({
        initialValues: {
            title: props.note.title,
            note: props.note.note
        }
    });

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

    }, [debouncedEditor, form.values.title]);

    useEffect(() => {
        const interval = setInterval(() => {
            setModifiedHuman(formatDistanceToNow(modified, { includeSeconds: true }));
        }, 1000);
        return () => clearInterval(interval);
    }, [modified]);

    return (
        <NoteLayout notes={props.notesTitleOnly}>
            <Container size="lg" px="xs">
                <Grid>
                    <Grid.Col span={11}>
                        <Input variant="unstyled" {...form.getInputProps('title')} placeholder="Title" mb="xl" styles={() => ({ input: { borderBottom: '1px solid' } })} radius="xs" size="md" />
                    </Grid.Col>
                    <Grid.Col ta="center" span={1}>
                        <Container>
                            <ThemeIcon hidden={!saveIndicator} radius="xl" size="xl" color="dark">
                                <IconDeviceFloppy />
                            </ThemeIcon>
                        </Container>
                    </Grid.Col>
                </Grid>
                <Group position='apart'>
                    <Text c="dimmed">Created {formatDistanceToNow(new mongoose.Types.ObjectId(props.note._id).getTimestamp())} ago</Text>
                    <Text c="dimmed">Modified {modifiedHuman} ago</Text>
                </Group>

                <RichTextEditor editor={editor}>
                    <RichTextEditor.Toolbar sticky stickyOffset={60}>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Bold />
                            <RichTextEditor.Italic />
                            <RichTextEditor.Underline />
                            <RichTextEditor.Strikethrough />
                            <RichTextEditor.ClearFormatting />
                            <RichTextEditor.Code />
                        </RichTextEditor.ControlsGroup>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.H1 />
                            <RichTextEditor.H2 />
                            <RichTextEditor.H3 />
                            <RichTextEditor.H4 />
                        </RichTextEditor.ControlsGroup>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Blockquote />
                            <RichTextEditor.Hr />
                            <RichTextEditor.BulletList />
                            <RichTextEditor.OrderedList />
                        </RichTextEditor.ControlsGroup>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Link />
                            <RichTextEditor.Unlink />
                        </RichTextEditor.ControlsGroup>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Control onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3 }).run()}>
                                <IconTable stroke={1} color='#333' />
                            </RichTextEditor.Control>
                        </RichTextEditor.ControlsGroup>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Control onClick={() => editor?.chain().focus().addColumnBefore().run()}>
                                <IconColumnInsertLeft stroke={1} color='#000' />
                            </RichTextEditor.Control>
                            <RichTextEditor.Control onClick={() => editor?.chain().focus().addColumnAfter().run()}>
                                <IconColumnInsertRight stroke={1} color='#000' />
                            </RichTextEditor.Control>
                            <RichTextEditor.Control onClick={() => editor?.chain().focus().addRowBefore().run()}>
                                <IconRowInsertTop stroke={1} color='#000' />
                            </RichTextEditor.Control>
                            <RichTextEditor.Control onClick={() => editor?.chain().focus().addRowAfter().run()}>
                                <IconRowInsertBottom stroke={1} color='#000' />
                            </RichTextEditor.Control>
                        </RichTextEditor.ControlsGroup>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Control onClick={() => editor?.chain().focus().deleteTable().run()}>
                                <IconTableOff stroke={1} color='#000' />
                            </RichTextEditor.Control>
                            <RichTextEditor.Control onClick={() => editor?.chain().focus().deleteColumn().run()}>
                                <RiDeleteColumn color='#666' size={24} />
                            </RichTextEditor.Control>
                            <RichTextEditor.Control onClick={() => editor?.chain().focus().deleteRow().run()}>
                                <RiDeleteRow color='#666' size={24} />
                            </RichTextEditor.Control>
                        </RichTextEditor.ControlsGroup>
                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Control onClick={() => editor?.chain().focus().insertContent(`<p><strong>${format(new Date(), 'MM/dd/yyyy h:mm a')}</strong></p>`).unsetBold().run()}>
                                <IconClockHour8 stroke={1} color='#000' />
                            </RichTextEditor.Control>
                        </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>
                    <RichTextEditor.Content />
                </RichTextEditor>
            </Container>
        </NoteLayout>
    );
};

export default Page;

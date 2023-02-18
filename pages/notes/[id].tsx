import NoteLayout from '@/components/NoteLayout';
import { RichTextEditor, Link } from '@mantine/tiptap';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Input, Container, Grid, ThemeIcon, validateJson } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { INote } from '@/data/models/Note';
import { INavigation } from '@/data/models/Navigation';
import { useForm } from '@mantine/form';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { useDebounce } from 'use-debounce';
import { useEffect, useRef, useState } from 'react';
import { getContent, saveContent } from '../../services/notes';
import { IconColumnInsertLeft, IconColumnInsertRight, IconDeviceFloppy, IconRowInsertBottom, IconRowInsertTop, IconTable, IconTableOff } from '@tabler/icons';

import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import { RiDeleteColumn, RiDeleteRow } from 'react-icons/ri';


export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);

    const { id } = context.query;

    const resNavigation = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/navigations/user/${session?.user.id}`);
    const dataNavigation = await resNavigation.json();

    const dataNote = await getContent(id as string);

    return {
        props: {
            navigation: dataNavigation,
            note: dataNote
        }
    };
};

type Props = {
    navigation: INavigation;
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
                .then(() => setSaveIndicator(false));
        } else {
            loaded.current = true;
        }

    }, [debouncedEditor, form.values.title]);

    return (
        <NoteLayout navigation={props.navigation}>
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
                    </RichTextEditor.Toolbar>
                    <RichTextEditor.Content />
                </RichTextEditor>
            </Container>
        </NoteLayout>
    );
};

export default Page;

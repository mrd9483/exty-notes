import NoteLayout from '@/components/NoteLayout';
import { RichTextEditor, Link } from '@mantine/tiptap';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Input, Container, Group, Grid, ActionIcon, Center, ThemeIcon, validateJson } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { INote } from '@/data/models/Note';
import { INavigation } from '@/data/models/Navigation';
import { useForm } from '@mantine/form';
import { authOptions } from 'pages/api/auth/[...nextauth]';
import { getServerSession } from 'next-auth/next';
import { useDebounce } from 'use-debounce';
import { useEffect, useRef, useState } from 'react';
import { saveContent } from '../../services/notes';
import { IconDeviceFloppy } from '@tabler/icons';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getServerSession(context.req, context.res, authOptions);

    const { id } = context.query;

    const resNavigation = await fetch(`http://localhost:3000/api/navigations/user/${session?.user.id}`);
    const dataNavigation = await resNavigation.json();

    const resNote = await fetch(`http://localhost:3000/api/notes/${id}`);
    const dataNote = await resNote.json();

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
            Underline
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
                            <RichTextEditor.Highlight />
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
                            <RichTextEditor.Subscript />
                            <RichTextEditor.Superscript />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.Link />
                            <RichTextEditor.Unlink />
                        </RichTextEditor.ControlsGroup>

                        <RichTextEditor.ControlsGroup>
                            <RichTextEditor.AlignLeft />
                            <RichTextEditor.AlignCenter />
                            <RichTextEditor.AlignJustify />
                            <RichTextEditor.AlignRight />
                        </RichTextEditor.ControlsGroup>
                    </RichTextEditor.Toolbar>

                    <RichTextEditor.Content />
                </RichTextEditor>
            </Container>
        </NoteLayout>
    );
};

export default Page;

import NoteLayout from '@/components/NoteLayout';
import { RichTextEditor, Link } from '@mantine/tiptap';
import Underline from '@tiptap/extension-underline';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Input, Container } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { INote } from '@/data/models/Note';
import { INavigation } from '@/data/models/Navigation';
import { useForm } from '@mantine/form';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { id } = context.query;

    const resNavigation = await fetch('http://localhost:3000/api/navigations/user/63d559fbd82fcc2c546416e2');
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
    const content = props.note.note;
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link,
            Underline
        ],
        content
    });

    const form = useForm({
        initialValues: {
            title: props.note.title,
            note: props.note.note
        },
    });

    return (
        <NoteLayout navigation={props.navigation}>
            <Container size="lg" px="xs">
                <Input variant="unstyled" {...form.getInputProps('title')} placeholder="Title" mb="xl" styles={() => ({ input: { borderBottom: '1px solid' } })} radius="xs" size="xl" />
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

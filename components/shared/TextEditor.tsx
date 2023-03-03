import { RichTextEditor } from '@mantine/tiptap';
import { IconClockHour8, IconColumnInsertLeft, IconColumnInsertRight, IconRowInsertBottom, IconRowInsertTop, IconTable, IconTableOff } from '@tabler/icons';
import { Editor } from '@tiptap/react';
import { format } from 'date-fns';
import { RiDeleteColumn, RiDeleteRow } from 'react-icons/ri';

type Props = {
    editor: Editor | null;
}

export const TextEditor = (props: Props) => {

    const editor = props.editor;

    return (
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
    );
};

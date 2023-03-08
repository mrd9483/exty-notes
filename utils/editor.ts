import Link from '@tiptap/extension-link';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TaskItem from '@tiptap/extension-task-item';
import TaskList from '@tiptap/extension-task-list';
import Underline from '@tiptap/extension-underline';
import { Content, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

const getEditor = (content: Content | undefined) => useEditor({
    extensions: [
        StarterKit,
        Link,
        Underline,
        Table.configure({ resizable: true }),
        TableCell,
        TableHeader,
        TableRow,
        TaskList,
        TaskItem,
    ],
    content,
});

export default getEditor;

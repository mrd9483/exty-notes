/* eslint-disable react/prop-types */
import { ActionIcon, AppShell, Drawer, Group, Header, Menu, Title, useMantineTheme } from '@mantine/core';
import { ReactNode, useState } from 'react';
import { IconCheckbox, IconClockHour8, IconLogin, IconLogout, IconMenu2, IconNotes, IconSlash } from '@tabler/icons';
import { signIn, signOut, useSession } from 'next-auth/react';
import CommandLineDialog from '../commandLine/CommandLineDialog';
import { useWindowEvent } from '@mantine/hooks';
import CLIParser from '@/utils/CLIParser';
import { addNote } from '@/services/notes';
import { useRouter } from 'next/router';
import { saveEntry } from '@/services/entries';
import * as chrono from 'chrono-node';
import { toast } from 'react-toastify';
import { saveTask } from '@/services/tasks';
import { taskService, templateService, timeService } from '@/utils/listeners';
import TaskList from '../tasks/TaskList';
import Link from 'next/link';

type Props = {
    children: ReactNode;
    menu?: ReactNode;
};

const Layout: React.FC<Props> = (props) => {
    const { data: session } = useSession();
    const router = useRouter();
    const theme = useMantineTheme();

    const [commandOpened, setCommandOpened] = useState(false);
    const [triggerFocus, setTriggerFocus] = useState(false);
    const [commandDisabled, setCommandDisabled] = useState(false);
    const [taskOpened, setTaskOpened] = useState(false);

    useWindowEvent('keydown', (event) => {
        if (event.code === 'Slash' && (event.ctrlKey || event.metaKey)) {
            event.preventDefault();
            setCommandOpened((o) => !o);
        }
    });

    const addNoteOnEnter = async (title: string) => {
        const resAddNote = await addNote(session?.user.id as string, title);
        const path = { pathname: '/notes/[id]', query: { id: resAddNote._id } };
        router.push(path).then(() => router.reload());
    };

    const addTaskOnEnter = async (task: string) => {
        try {
            const obj = await saveTask(session?.user.id as string, task);
            toast.success('Task Saved');
            taskService.setData(obj._id);
        } catch {
            toast.error('Task save failed');
        }

        setCommandDisabled(false);
    };

    const addTimeOnEnter = async (hours: string, task: string, when: string) => {
        const whenDate = chrono.parseDate(when) ?? new Date();
        const hoursNumber = parseFloat(hours);

        const response = await saveEntry(session?.user.id as string, whenDate, task.replace('"', ''), hoursNumber);
        if (response.status === 200) {
            const obj = await response.json();
            toast.success('Time Saved');
            timeService.setData(obj._id);
        } else {
            throw new Error('Time entry incorrect');
        }
        setCommandDisabled(false);
    };

    const addTemplateOnEnter = async (shortcut: string) => {
        templateService.setData(shortcut);
        setCommandDisabled(true);
    };

    const handleEnter = async (command: string) => {
        if (!commandDisabled) {
            setCommandDisabled(true);
            const p = new CLIParser({
                'note': { arguments: [{ optional: false, description: 'title' }] },
                'time': {
                    arguments: [
                        { optional: false, description: 'hours' },
                        { optional: false, description: 'task' },
                        { optional: true, description: 'when' },
                    ]
                },
                'task': { arguments: [{ optional: false, description: 'entry' }] },
                't': { arguments: [{ optional: false, description: 'shortcut' }] },
                'fart': {}
            },
                {
                    'note': (...args: string[]) => { addNoteOnEnter(args.join(' ')); },
                    'time': (...args: string[]) => { addTimeOnEnter(args[0], args[1], args[2]); },
                    'task': (...args: string[]) => { addTaskOnEnter(args.join(' ')); },
                    't': (...args: string[]) => { addTemplateOnEnter(args[0]); },
                    'fart': () => { toast.info('💩💩💩'); setCommandDisabled(false); }
                }
            );
            try {
                p.parse(command);
            } catch (error) {
                toast.error(`${error}`);
                setCommandDisabled(false);
            }
        }
    };

    const handleClick = () => {
        setCommandOpened((o) => !o);
        if (commandOpened) {
            setTriggerFocus((t) => !t);
        }
    };

    const handleTask = () => {
        setTaskOpened(true);
    };

    const handleTime = () => {
        setCommandOpened((o) => !o);
        if (commandOpened) {
            setTriggerFocus((t) => !t);
        }
    };

    return (
        <AppShell
            padding="md"
            navbar={<>{props.menu ?? <></>}</>}
            header={
                <Header height={65} p="xs" sx={() => ({ background: 'linear-gradient(90deg, rgba(58,110,250,1) 0%, rgba(58,60,180,1) 100%);' })}>
                    <Group position="apart" align="center">
                        <Link href='/' className="title">
                            <Title sx={{ color: '#ffffff' }}>notes for .me</Title>
                        </Link>
                        <Group>
                            <ActionIcon variant='gradient' size='lg' onClick={handleTime}>
                                <IconClockHour8 size={20} stroke={3} />
                            </ActionIcon>
                            <ActionIcon variant='gradient' size='lg' onClick={handleTask}>
                                <IconCheckbox size={20} stroke={3} />
                            </ActionIcon>
                            <ActionIcon variant='gradient' size='lg' onClick={handleClick}>
                                <IconSlash size={20} stroke={3} />
                            </ActionIcon>
                            <Menu shadow="xl" width={200} radius="sm">
                                <Menu.Target>
                                    <ActionIcon variant='gradient' size="lg">
                                        <IconMenu2 size={20} stroke={3} />
                                    </ActionIcon>
                                </Menu.Target>
                                {session ?
                                    <Menu.Dropdown>
                                        <Menu.Item component='a' href='/notes' icon={<IconNotes size={16} />}>Notes</Menu.Item>
                                        <Menu.Item component='a' href='/time-entry' icon={<IconClockHour8 size={16} />}>Time Entry</Menu.Item>
                                        <Menu.Item component='a' href='/tasks' icon={<IconCheckbox size={16} />}>Tasks</Menu.Item>
                                        <Menu.Divider />
                                        <Menu.Item onClick={() => signOut({ callbackUrl: '/' })} icon={<IconLogout size={16} />}>Log out</Menu.Item>
                                    </Menu.Dropdown> :
                                    <Menu.Dropdown>
                                        <Menu.Item onClick={() => signIn()} icon={<IconLogin size={16} />}>Log In</Menu.Item>
                                    </Menu.Dropdown>
                                }
                            </Menu>
                        </Group>
                    </Group>
                </Header>
            }
            styles={(theme) => ({
                main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
            })}
        >
            <>
                {props.children}
                <CommandLineDialog opened={commandOpened} disabled={commandDisabled} triggerFocus={triggerFocus} onEnter={handleEnter} />
            </>
            <Drawer
                opened={taskOpened}
                onClose={() => setTaskOpened(false)}
                size={400}
                overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
                overlayOpacity={0.55}
                overlayBlur={3}
                transition="rotate-left"
                transitionDuration={250}
                transitionTimingFunction="ease"
                position="right"
            >
                {
                    <TaskList showComplete={false} />
                }
            </Drawer>
        </AppShell>
    );
};

export default Layout;

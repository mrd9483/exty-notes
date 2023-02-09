/* eslint-disable react/prop-types */
import { AppShell, Header, Title, Group, ActionIcon, Menu, Box, Center } from '@mantine/core';
import { ReactNode } from 'react';
import { IconCheckbox, IconClockHour8, IconLogin, IconLogout, IconMenu2, IconNotes } from '@tabler/icons';
import { signIn, signOut, useSession } from 'next-auth/react';

type Props = {
  children: ReactNode;
  menu: ReactNode;
};

const Layout: React.FC<Props> = (props) => {
  const { data: session } = useSession();

  return (
    <AppShell
      padding="md"
      navbar={<>{props.menu}</>}
      header={
        <Header height={65} p="xs" sx={() => ({ background: 'linear-gradient(90deg, rgba(58,60,180,1) 42%, rgba(253,29,29,1) 80%, rgba(252,176,69,1) 100%);' })}>
            <Group position="apart" align="center">
              <Title sx={{color:'#ffffff'}}>MyNote</Title>
              <Menu shadow="xl" width={200} radius="sm">
                <Menu.Target>
                  <ActionIcon variant="filled" size="lg">
                    <IconMenu2 size={20} />
                  </ActionIcon>
                </Menu.Target>
                {session ?
                  <Menu.Dropdown>
                    <Menu.Item component='a' href='/notes' icon={<IconNotes size={16} />}>Notes</Menu.Item>
                    <Menu.Item component='a' href='/time-entry' icon={<IconClockHour8 size={16} />}>Time Entry</Menu.Item>
                    <Menu.Item component='a' href='/notes' icon={<IconCheckbox size={16} />}>Tasks</Menu.Item>
                    <Menu.Divider />
                    <Menu.Item onClick={() => signOut({ callbackUrl: '/' })} icon={<IconLogout size={16} />}>Log out</Menu.Item>
                  </Menu.Dropdown> :
                  <Menu.Dropdown>
                    <Menu.Item onClick={() => signIn()} icon={<IconLogin size={16} />}>Log In</Menu.Item>
                  </Menu.Dropdown>
                }
              </Menu>

            </Group>
        </Header>
      }
      styles={(theme) => ({
        main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
      })}
    >
      {props.children}
    </AppShell>
  );
};

export default Layout;

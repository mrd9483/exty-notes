/* eslint-disable react/prop-types */
import { AppShell, Header, Title, Group, ActionIcon, Menu, Button } from '@mantine/core';
import { ReactNode } from 'react';
import { IconCheckbox, IconClockHour8, IconLogout, IconMenu2, IconNotes } from '@tabler/icons';

type Props = {
  children: ReactNode;
  menu: ReactNode;
};

const Layout: React.FC<Props> = (props) => {
  return (
    <AppShell
      padding="md"
      navbar={<>{props.menu}</>}
      header={
        <Header height={60} p="xs">
          <Group position="apart">
            <Title>Extynote</Title>
            <Menu shadow="xl" width={200} radius="sm">
              <Menu.Target>
                <ActionIcon variant="default" size="lg">
                  <IconMenu2 size={20} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item icon={<IconNotes size={16} />}>Notes</Menu.Item>
                <Menu.Item icon={<IconClockHour8 size={16} />}>Time Entry</Menu.Item>
                <Menu.Item icon={<IconCheckbox size={16} />}>Tasks</Menu.Item>
                <Menu.Divider />
                <Menu.Item icon={<IconLogout size={16} />}>Log out</Menu.Item>
              </Menu.Dropdown>
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

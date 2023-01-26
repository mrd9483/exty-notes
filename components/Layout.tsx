/* eslint-disable react/prop-types */
import { AppShell, Navbar, Header, Box, NavLink, Title } from '@mantine/core';
import { ReactNode } from 'react';
import { NextRouter, useRouter } from 'next/router';

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
          <Title>Extynote</Title>
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

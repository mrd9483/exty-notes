/* eslint-disable react/prop-types */
import { AppShell, Navbar, Header, Box, NavLink } from '@mantine/core';
import { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  navigation: Array<JSON>;
};

const navigationBuilder = (navigation: Array<JSON>) => {
  if (navigation.length === 0)
    return null;

  return (
    <>
      {navigation.map((n: any) => (
        <NavLink key={n.id} label={n.title}>
          {navigationBuilder(n.navigation)}
        </NavLink>
      ))}
    </>
  );
};

const Layout: React.FC<Props> = (props) => {
  return (
    <AppShell
      padding="md"
      navbar={
        <Navbar width={{ base: 300 }}>
          <Box>
            {navigationBuilder(props.navigation)}
          </Box>
        </Navbar>
      }
      header={
        <Header height={60} p="xs">{/* Header content */}</Header>
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

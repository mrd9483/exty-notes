import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { GetServerSideProps } from 'next';
import { SessionProvider } from 'next-auth/react';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch('http://localhost:3000/api/navigations?userId=63c8beac4d9af39b11524d02');
  const data = await res.json();
  return { props: { navigation: data } };
};

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {

  return (
    <SessionProvider session={session}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'dark' }}>
        <Component {...pageProps} />
      </MantineProvider>
    </SessionProvider>
  );
}

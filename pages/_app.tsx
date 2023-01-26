import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { GetServerSideProps } from 'next';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const res = await fetch('http://localhost:3000/api/navigations?userId=63c8beac4d9af39b11524d02');
  const data = await res.json();
  return { props: { navigation: data } };
};

export default function App({ Component, pageProps }: AppProps) {

  return (
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'dark' }}>
      <Component {...pageProps} />
    </MantineProvider>
  );
}

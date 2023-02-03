import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { SessionProvider } from 'next-auth/react';

export default function App({ Component, pageProps }: AppProps) {

  return (
    <SessionProvider session={pageProps.session}>
      <MantineProvider withGlobalStyles withNormalizeCSS theme={{ colorScheme: 'dark' }}>
        <Component {...pageProps} />
      </MantineProvider>
    </SessionProvider>
  );
}

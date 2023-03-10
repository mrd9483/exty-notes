import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.min.css';
import '../styles/noteStyle.scss';

export default function App({ Component, pageProps }: AppProps) {

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <SessionProvider session={pageProps.session}>
                    <Component {...pageProps} />
                    <ToastContainer position="top-center" theme="colored" />
            </SessionProvider>
        </MantineProvider>
    );
}

import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import NextNProgress from 'nextjs-progressbar';
import axios from 'axios';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

import 'react-toastify/dist/ReactToastify.min.css';
import '../styles/noteStyle.scss';


export default function App({ Component, pageProps }: AppProps) {

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <SessionProvider session={pageProps.session}>
                <NextNProgress height={7} showOnShallow />
                <Component {...pageProps} />
                <ToastContainer position="top-center" theme="colored" />
            </SessionProvider>
        </MantineProvider>
    );
}

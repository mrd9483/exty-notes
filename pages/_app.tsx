import type { AppProps } from 'next/app';
import { MantineProvider } from '@mantine/core';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import NextNProgress from 'nextjs-progressbar';
import axios from 'axios';
import { Analytics } from '@vercel/analytics/react';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;

import 'react-toastify/dist/ReactToastify.min.css';
import '../styles/noteStyle.scss';
import { useRouter } from 'next/router';


export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    return (
        <MantineProvider withGlobalStyles withNormalizeCSS>
            <SessionProvider session={pageProps.session}>
                <NextNProgress height={7} showOnShallow />
                <Component {...pageProps} key={router.asPath} />
                <Analytics />
                <ToastContainer position="top-center" theme="colored" />
            </SessionProvider>
        </MantineProvider>
    );
}

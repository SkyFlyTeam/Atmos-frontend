import type { AppProps } from 'next/app';
import Head from 'next/head';

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <link
          href="https://fonts.googleapis.com/css2?family=Londrina+Solid:wght@400;700;900&display=swap"
          rel="stylesheet"
        />
      </Head>
      <main className="flex flex-1 flex-col gap-4">
        <Component {...pageProps} />
      </main>
    </>
  );
}

export default MyApp;

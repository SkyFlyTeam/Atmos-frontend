import type { AppProps } from 'next/app';

import "../styles/globals.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
        <main className="flex flex-1 flex-col gap-4 md:px-12 px-4 py-0">
          <Component {...pageProps} />
        </main>
  );
}

export default MyApp;

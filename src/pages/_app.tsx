import type { AppProps } from 'next/app';
import { Lato, Londrina_Solid } from 'next/font/google';

import "../styles/globals.css";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const lato = Lato({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['latin']
})

const londrina = Londrina_Solid({
  weight: ['100', '300', '400', '900'],
  subsets: ['latin']
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
      <main className={`flex flex-1 flex-col gap-4 md:px-12 px-4 py-0 ${londrina.className} ${lato.className}`}>
        <Component {...pageProps} />
        <ToastContainer position="bottom-right" autoClose={2000} />
      </main>
  );
}

export default MyApp;

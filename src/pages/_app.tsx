import type { AppProps } from 'next/app';

import Navbar from '@/components/Navbar/Navbar';

import "../styles/globals.css";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { lato, londrina } from '@/lib/fonts';



function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Navbar />
      <main className={`flex flex-1 flex-col gap-4 md:px-12 px-4 py-6 ${londrina} ${lato}`}>
        <Component {...pageProps} />
        <ToastContainer position="bottom-right" autoClose={2000} />
      </main>
    </>
      
  );
}

export default MyApp;

import { Lato, Londrina_Solid } from 'next/font/google';

const latoFont = Lato({
  weight: ['100', '300', '400', '700', '900'],
  subsets: ['latin']
})
export const lato = latoFont.className;

const londrinaFont = Londrina_Solid({
  weight: ['100', '300', '400', '900'],
  subsets: ['latin']
})
export const londrina = londrinaFont.className;



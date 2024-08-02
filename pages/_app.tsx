import BrazeProvider from '@/pages/braze-context';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <BrazeProvider>
      <Component {...pageProps} />
    </BrazeProvider>
  );
}

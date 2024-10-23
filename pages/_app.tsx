import '@/styles/globals.css';
import type { AppProps } from 'next/app';

import BrazeProvider from '@/contexts/braze-context';
import { EventsTrackerProvider } from '@/contexts/events-provider';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <div
    id="leafwell-container"
  >
    <BrazeProvider>
      <EventsTrackerProvider>
        <Component {...pageProps} key={router.asPath} />
        </EventsTrackerProvider>
    </BrazeProvider>
  </div>
  )
}

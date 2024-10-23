import React, { createContext, useContext } from 'react';
import { useBrazeContext } from '@/contexts/braze-context';


export type EventParams = {
  event: string;
  variant?: 'control' | 'test';
  [key: string]: string | number | boolean;
};

export type EventsTrackerContextProps = {
  trackEvent: (props: EventParams) => void;
};

const EventsTrackerContext = createContext<EventsTrackerContextProps>(null);

export const EventsTrackerProvider = ({
  children,
}: {
  children: React.ReactElement;
}): JSX.Element => {
  const { logCustomEvent } = useBrazeContext();

  const trackEvent = (props: EventParams) => {
    logCustomEvent(props.event, props);
  };

  return (
    <EventsTrackerContext.Provider value={{ trackEvent }}>
      {children}
    </EventsTrackerContext.Provider>
  );
};

export const useEventsTracker = (): EventsTrackerContextProps => {
  const eventsTrackerContext = useContext(EventsTrackerContext);

  if (eventsTrackerContext === null) {
    throw new Error('No "EventsTrackerProvider" configured');
  }

  return eventsTrackerContext;
};

import {
  logCustomEvent,
  requestImmediateDataFlush,
  subscribeToInAppMessage,
  requestContentCardsRefresh,
  getUser,
  changeUser,
} from '@braze/web-sdk';
import type { Card } from '@braze/web-sdk';

import React, { createContext, useContext, useEffect, useState } from 'react';

type SaveUserParams = {
  name?: string;
  email?: string;
  phone?: string;
  customAttributes?: {
    [key: string]: string | number;
  };
};

export type BrazeContextValue = {
  hasBrazeInitialized: boolean;
  logCustomEvent: typeof logCustomEvent;
  requestImmediateDataFlush: typeof requestImmediateDataFlush;
  subscribeToInAppMessage: typeof subscribeToInAppMessage;
  fetchContentCards: (callback: (cards: Card[]) => void) => void;
  requestContentCardsRefresh: typeof requestContentCardsRefresh;
  getUser: typeof getUser;
  changeUser: typeof changeUser;
};

const DEFAULT_CONTEXT_VALUES = {
  hasBrazeInitialized: false,
  logCustomEvent: () => null,
  requestImmediateDataFlush: () => null,
  subscribeToInAppMessage: () => null,
  fetchContentCards: () => null,
  requestContentCardsRefresh: () => null,
  getUser: () => null,
  changeUser: () => null,
};

export const BrazeContext = createContext<BrazeContextValue>(
  DEFAULT_CONTEXT_VALUES,
);

export function useBrazeContext(): BrazeContextValue {
  return useContext(BrazeContext);
}

export default function BrazeProvider({
  children,
}: {
  children: React.ReactElement;
}): JSX.Element {
  const [contextValue, setContextValue] = useState<BrazeContextValue>(
    DEFAULT_CONTEXT_VALUES,
  );

  useEffect(() => {
    (async function () {
      // initialize braze as per docs - https://www.braze.com/docs/developer_guide/platform_integration_guides/web/initial_sdk_setup/#ssr
      const {
        initialize,
        openSession,
        logCustomEvent,
        getUser,
        changeUser,
        subscribeToInAppMessage,
        subscribeToContentCardsUpdates,
        requestContentCardsRefresh,
        requestImmediateDataFlush,
        automaticallyShowInAppMessages,
      } = await import('@braze/web-sdk');

      const hasBrazeInitialized = initialize(
        process.env.NEXT_PUBLIC_BRAZE_API_KEY,
        {
          baseUrl: process.env.NEXT_PUBLIC_BRAZE_SDK_ENDPOINT,
          enableLogging: process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production',
        },
      );

      const brazeUser = getUser();
      const brazeUserId = brazeUser.getUserId();

      if (!brazeUserId) {
        const id = crypto.randomUUID();
        changeUser(id);
      }

      automaticallyShowInAppMessages();

      openSession();

      setContextValue({
        ...contextValue,
        hasBrazeInitialized,
        logCustomEvent,
        requestImmediateDataFlush,
        subscribeToInAppMessage,
        requestContentCardsRefresh,
        fetchContentCards: callback => {
          subscribeToContentCardsUpdates(contentCards => {
            callback(contentCards.cards);
          });

          requestContentCardsRefresh();
        },
        getUser,
        changeUser: id => {
          changeUser(id);
          openSession();
        },
      });
    })();
  }, []);

  return (
    <BrazeContext.Provider value={contextValue}>
      {children}
    </BrazeContext.Provider>
  );
}

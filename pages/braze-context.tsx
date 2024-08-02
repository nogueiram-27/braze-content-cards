import type {
  logCustomEvent,
  requestImmediateDataFlush,
  subscribeToInAppMessage,
  subscribeToContentCardsUpdates,
  requestContentCardsRefresh,
  getUser,
  changeUser,
} from '@braze/web-sdk';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type BrazeContextValue = {
  hasBrazeInitialized: boolean;
  logCustomEvent: typeof logCustomEvent;
  requestImmediateDataFlush: typeof requestImmediateDataFlush;
  subscribeToInAppMessage: typeof subscribeToInAppMessage;
  subscribeToContentCardsUpdates: typeof subscribeToContentCardsUpdates;
  requestContentCardsRefresh: typeof requestContentCardsRefresh;
  getUser: typeof getUser;
  changeUser: typeof changeUser;
};

const DEFAULT_CONTEXT_VALUES = {
  hasBrazeInitialized: false,
  logCustomEvent: () => null,
  requestImmediateDataFlush: () => null,
  subscribeToInAppMessage: () => null,
  subscribeToContentCardsUpdates: () => null,
  requestContentCardsRefresh: () => null,
  getUser: () => null,
  changeUser: () => null,
};

export const BrazeContext = createContext<BrazeContextValue>(
  DEFAULT_CONTEXT_VALUES
);

export function useBrazeContext(): BrazeContextValue {
  return useContext(BrazeContext);
}

export default function BrazeProvider({
  children,
}: {
  children: React.ReactElement;
}): JSX.Element {
  const [contextValue, _] = useState<BrazeContextValue>(DEFAULT_CONTEXT_VALUES);

  useEffect(() => {
    import('@braze/web-sdk').then(
      ({
        initialize,
        subscribeToContentCardsUpdates,
        getCachedContentCards,
        changeUser,
        openSession,
        getUser,
      }) => {
        initialize(process.env.NEXT_PUBLIC_BRAZE_API_KEY, {
          baseUrl: process.env.NEXT_PUBLIC_BRAZE_SDK_ENDPOINT,
          enableLogging: process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production',
        });

        const cards = getCachedContentCards();
        console.log('🚀 ~ import cached ~ cards:', cards);

        subscribeToContentCardsUpdates((updatedCards) => {
          console.log(
            '🚀 ~ subscribeToContentCardsUpdates ~ updatedCards:',
            updatedCards
          );
        });

        const brazeUser = getUser();
        let brazeUserId = brazeUser.getUserId();
        console.log('Existing braze user id: ', brazeUserId);

        if (!brazeUserId) {
          brazeUserId = crypto.randomUUID();
          console.log('newly created braze user id: ', brazeUserId);
        }
        changeUser(brazeUserId);

        openSession();
      }
    );
  }, []);

  return (
    <BrazeContext.Provider value={contextValue}>
      {children}
    </BrazeContext.Provider>
  );
}

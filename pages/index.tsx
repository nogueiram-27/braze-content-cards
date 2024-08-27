import { useEffect, useState } from 'react';

export default function Home() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    import('@braze/web-sdk').then(
      ({
        initialize,
        subscribeToContentCardsUpdates,
        requestContentCardsRefresh,
        openSession,
        toggleLogging,
        getUser
      }) => {
        initialize(process.env.NEXT_PUBLIC_BRAZE_API_KEY, {
          baseUrl: process.env.NEXT_PUBLIC_BRAZE_SDK_ENDPOINT,
          enableLogging: true,
        });

        // Subscribe to content card updates
        subscribeToContentCardsUpdates((updatedCards) => {
          console.log('🚀 ~ subscribeToContentCardsUpdates ~ updatedCards:', updatedCards);
          setCards(updatedCards.cards);
        });

        // Open session and request content cards refresh
        openSession();
        requestContentCardsRefresh();

        console.log(getUser());
      }
    );
  }, []);

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <div>
        {cards.map((card) => (
          <div key={card.id}>
            <h3>{card.title}</h3>
            <p>{card.description}</p>
            {card.imageUrl && <img src={card.imageUrl} alt={card.title} />}
            {card.url && (
              <a href={card.url} target="_blank" rel="noopener noreferrer">
                Learn more
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
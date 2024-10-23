import type { CaptionedImage, ClassicCard, Card } from '@braze/web-sdk';
import { useRouter } from 'next/router';

import React, { useEffect, useState } from 'react';
import { useBrazeContext } from '@/contexts/braze-context';
import { useEventsTracker } from '@/contexts/events-provider';

type PageWrapProps = {
  children: React.ReactElement | React.ReactElement[];
};

type ContentCard = CaptionedImage | ClassicCard;

const PageWrap: React.FC<PageWrapProps> = ({
  children,
}) => {
  const [contentCards, setContentCards] = useState<ContentCard[] | null>(null);
  const { asPath } = useRouter();
  const { hasBrazeInitialized, fetchContentCards, getUser, logCustomEvent } = useBrazeContext();
  const { trackEvent } = useEventsTracker();

  useEffect(() => {
    if (!hasBrazeInitialized) {
      return;
    }

    if (asPath === '/') {
      trackEvent({
        event: 'website_visit_homepage',
      });
    } else if (asPath?.includes('/blog')) {
      trackEvent({
        event: 'website_visit_blog',
      });
    } else if (asPath?.includes('/medical-card')) {
      trackEvent({
        event: 'website_visit_medical_card',
      });
    } else if (asPath?.includes('/medical-conditions')) {
      trackEvent({
        event: 'website_visit_medical_conditions',
      });
    } else if (asPath?.includes('/research')) {
      trackEvent({
        event: 'website_visit_research',
      });
    } else if (asPath?.includes('/cannabis-strains')) {
      trackEvent({
        event: 'website_visit_strains',
      });
    } else if (asPath?.includes('/partner-with-leafwell')) {
      trackEvent({
        event: 'website_visit_partners',
      });
    } else if (asPath === '/about') {
      trackEvent({
        event: 'website_visit_about',
      });
    } else if (asPath === '/careers') {
      trackEvent({
        event: 'website_visit_careers',
      });
    } else if (asPath === '/contact-us') {
      trackEvent({
        event: 'website_visit_contact_us',
      });
    } else if (asPath === '/employers') {
      trackEvent({
        event: 'website_visit_employers',
      });
    } else if (asPath === '/cannabis-guidance') {
      trackEvent({
        event: 'website_visit_cannabis_guidance',
      });
    }

    console.log('User: ', getUser().getUserId());
    // Fetch content cards on component mount
    fetchContentCards(fetchedCards => {
      console.log('Fetched Cards: ', fetchedCards)
      setContentCards(fetchedCards as ContentCard[]);
    });
  }, [hasBrazeInitialized, asPath, fetchContentCards, trackEvent, getUser]);


  return (
    <main className="grow xl:pt-40 relative">{children}</main>
  );
};

export default PageWrap;

import { useEffect, useState } from 'react';

import { FormInstrument, Language } from '@douglasneuroinformatics/common';
import { useTranslation } from 'react-i18next';

import { useFetch } from '@/hooks/useFetch';
import { useNotificationsStore } from '@/stores/notifications-store';

/**
 * Returns the instrument with the provided identifier in the current language
 * @param identifier - the instrument's identifier
 */
export function useFetchInstrument(identifier: string) {
  const notifications = useNotificationsStore();
  const { t, i18n } = useTranslation();
  const [preferredLanguage, setPreferredLanguage] = useState<Language>(i18n.resolvedLanguage as Language);

  useEffect(() => {
    setPreferredLanguage(i18n.resolvedLanguage as Language);
  }, [i18n.resolvedLanguage]);

  const { data: instrument } = useFetch<FormInstrument>(
    `/v1/instruments/forms/${identifier}?lang=${preferredLanguage}`,
    [preferredLanguage],
    {
      onError: (error) => {
        setPreferredLanguage((prevLanguage) => {
          if (prevLanguage === 'en') {
            return 'fr';
          }
          return 'en';
        });
        notifications.add({ type: 'warning', message: t('instruments.fetchInstrument.notFound') });
        console.error(error);
      }
    }
  );

  return instrument;
}
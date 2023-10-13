import { useEffect, useMemo, useState } from 'react';

import { SearchBar, SelectDropdown } from '@douglasneuroinformatics/ui';
import type { FormInstrumentSummary } from '@open-data-capture/types';
import { animated, useTrail } from '@react-spring/web';
import { useTranslation } from 'react-i18next';

import { InstrumentCard } from './InstrumentCard';

export type InstrumentShowcaseProps = {
  instruments: FormInstrumentSummary[];
};

export const InstrumentShowcase = ({ instruments }: InstrumentShowcaseProps) => {
  const { i18n, t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const languageOptions = Array.from(new Set(instruments.map((item) => item.details.language))).map((item) => ({
    key: item,
    label: t(`languages.${item}`)
  }));

  const tagOptions = Array.from(new Set(instruments.flatMap((item) => item.tags))).map((item) => ({
    key: item,
    label: item
  }));

  const [selectedLanguages, setSelectedLanguages] = useState<typeof languageOptions>([]);
  const [selectedTags, setSelectedTags] = useState<typeof tagOptions>([]);

  useEffect(() => {
    const nativeLanguage = languageOptions.find((lang) => lang.key === i18n.resolvedLanguage);
    if (nativeLanguage) {
      setSelectedLanguages([nativeLanguage]);
    }
  }, [i18n.resolvedLanguage]);

  const filteredInstruments = useMemo(() => {
    return instruments.filter((instrument) => {
      const matchesSearch = instrument.details.title.toUpperCase().includes(searchTerm.toUpperCase());
      const matchesLanguages =
        selectedLanguages.length === 0 || selectedLanguages.find(({ key }) => key === instrument.details.language);
      const matchesTags =
        selectedTags.length === 0 || instrument.tags.some((tag) => selectedTags.find(({ key }) => key === tag));
      return matchesSearch && matchesLanguages && matchesTags;
    });
  }, [instruments, searchTerm, selectedLanguages, selectedTags]);

  const [trails] = useTrail(
    filteredInstruments.length,
    () => ({
      config: { friction: 60, tension: 280 },
      from: {
        opacity: 0,
        y: 80
      },
      reset: true,
      to: {
        opacity: 1,
        y: 0
      }
    }),
    [filteredInstruments]
  );

  return (
    <div>
      <div className="my-5 flex flex-col justify-between gap-5 lg:flex-row">
        <SearchBar
          size="md"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
        />
        <div className="flex flex-grow gap-2 lg:flex-shrink">
          <div className="flex flex-grow" data-cy="tags-btn-dropdown">
            <SelectDropdown
              options={tagOptions}
              selected={selectedTags}
              setSelected={setSelectedTags}
              title={t('instruments.availableInstruments.filters.tags')}
            />
          </div>
          <div className="flex flex-grow" data-cy="language-btn-dropdown">
            <SelectDropdown
              options={languageOptions}
              selected={selectedLanguages}
              setSelected={setSelectedLanguages}
              title={t('instruments.availableInstruments.filters.language')}
            />
          </div>
        </div>
      </div>
      <div className="relative grid grid-cols-1 gap-5">
        {trails.map((style, i) => (
          <animated.div key={i} style={style}>
            <InstrumentCard instrument={filteredInstruments[i]!} />
          </animated.div>
        ))}
      </div>
    </div>
  );
};
import { replacer, toBasicISOString, toLowerCase } from '@douglasneuroinformatics/libjs';
import { Button, Heading, Separator } from '@douglasneuroinformatics/libui/components';
import { useDownload } from '@douglasneuroinformatics/libui/hooks';
import { computeInstrumentMeasures } from '@opendatacapture/instrument-utils';
import { CopyButton } from '@opendatacapture/react-core';
import type { AnyUnilingualInstrument } from '@opendatacapture/runtime-core';
import { isSubjectWithPersonalInfo, removeSubjectIdScope } from '@opendatacapture/subject-utils';
import { filter } from 'lodash-es';
import { DownloadIcon, PrinterIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { InstrumentSummaryGroup } from './InstrumentSummaryGroup';

import type { SubjectDisplayInfo } from '../../types';

export type InstrumentSummaryProps = {
  data: any;
  instrument: AnyUnilingualInstrument;
  subject?: SubjectDisplayInfo;
  timeCollected: number;
};

export const InstrumentSummary = ({ data, instrument, subject, timeCollected }: InstrumentSummaryProps) => {
  const download = useDownload();
  const { i18n, t } = useTranslation('core');

  if (instrument.kind === 'SERIES') {
    return null;
  }

  const computedMeasures = filter(computeInstrumentMeasures(instrument, data), (_, key) => {
    return !instrument.measures?.[key]!.hidden;
  });

  const handleDownload = () => {
    const filename = `${instrument.internal.name}_${instrument.internal.edition}_${new Date(timeCollected).toISOString()}.json`;
    void download(filename, () => JSON.stringify(data, replacer, 2));
  };

  let language: string;
  if (instrument.language === 'en') {
    language = t('languages.english');
  } else if (instrument.language === 'fr') {
    language = t('languages.french');
  } else {
    language = instrument.language;
  }

  const copyText = Object.values(computedMeasures)
    .map(({ label, value }) => `${label}: ${value?.toString() ?? 'NA'}`)
    .join('\n');

  const results = Object.values(computedMeasures);

  return (
    <div className="print:bg-primary-foreground space-y-6 print:fixed print:left-0 print:top-0 print:z-50 print:h-screen print:w-screen">
      <div className="flex">
        <div className="flex-grow">
          <Heading variant="h4">
            {instrument.details.title.trim()
              ? t('summary.title', { title: instrument.details.title })
              : t('summary.titleFallback')}
          </Heading>
          <p className="text-muted-foreground text-sm">
            {t('summary.subtitle', {
              dateCompleted: new Date().toLocaleString(i18n.resolvedLanguage, {
                dateStyle: 'long',
                timeStyle: 'long'
              })
            })}
          </p>
        </div>
        <div className="hidden sm:flex sm:items-center sm:gap-1 print:hidden">
          <CopyButton text={copyText} variant="ghost" />
          <Button size="icon" type="button" variant="ghost" onClick={handleDownload}>
            <DownloadIcon />
          </Button>
          <Button size="icon" type="button" variant="ghost" onClick={print}>
            <PrinterIcon />
          </Button>
        </div>
      </div>
      <Separator />
      {subject && (
        <InstrumentSummaryGroup
          items={
            isSubjectWithPersonalInfo(subject)
              ? [
                  {
                    label: 'ID',
                    value: subject.id
                  },
                  {
                    label: t('fullName'),
                    value:
                      subject?.firstName && subject.lastName
                        ? `${subject.firstName} ${subject.lastName}`
                        : t('anonymous')
                  },
                  {
                    label: t('identificationData.dateOfBirth.label'),
                    value: subject.dateOfBirth ? toBasicISOString(subject.dateOfBirth) : null
                  },
                  {
                    label: t('identificationData.sex.label'),
                    value: subject.sex ? t(`identificationData.sex.${toLowerCase(subject.sex)}`) : null
                  }
                ]
              : [
                  {
                    label: 'ID',
                    value: removeSubjectIdScope(subject.id)
                  }
                ]
          }
          title={t('subject')}
        />
      )}
      <InstrumentSummaryGroup
        items={[
          {
            label: t('title'),
            value: instrument.details.title
          },
          {
            label: t('language'),
            value: language
          },
          {
            label: t('edition'),
            value: instrument.internal.edition
          }
        ]}
        title={t('instrument')}
      />
      {results.length > 0 && <InstrumentSummaryGroup items={results} title={t('results')} />}
    </div>
  );
};

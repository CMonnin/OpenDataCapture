import { useEffect, useMemo, useState } from 'react';

import { InstrumentInterpreter, type InterpretOptions } from '@opendatacapture/instrument-interpreter';
import { translateInstrument } from '@opendatacapture/instrument-utils';
import type { AnyInstrument, AnyUnilingualInstrument } from '@opendatacapture/runtime-core';
import { useTranslation } from 'react-i18next';

export type InterpretedInstrumentState =
  | { error: Error; status: 'ERROR' }
  | { instrument: AnyUnilingualInstrument; status: 'DONE' }
  | { status: 'LOADING' };

/**
 * Interpret an instrument bundle directly in the browser
 *
 * @param bundle - the JavaScript code to be interpreted directly in the browser
 * @returns The instrument generated from the code, translated into the current locale, if possible, otherwise the default
 */
export function useInterpretedInstrument(bundle: string, options?: InterpretOptions) {
  const interpreter = useMemo(() => new InstrumentInterpreter(), []);
  const [instrument, setInstrument] = useState<AnyInstrument | null>(null);
  const [state, setState] = useState<InterpretedInstrumentState>({ status: 'LOADING' });
  const { i18n } = useTranslation();

  useEffect(() => {
    interpreter
      .interpret(bundle, options)
      .then(setInstrument)
      .catch((error) => {
        console.error(error);
        setState({
          error: error instanceof Error ? error : new Error('Unexpected Non-Error Thrown', { cause: error }),
          status: 'ERROR'
        });
      });
  }, [bundle]);

  useEffect(() => {
    if (instrument) {
      setState({ instrument: translateInstrument(instrument, i18n.resolvedLanguage!), status: 'DONE' });
    }
  }, [i18n.resolvedLanguage, instrument]);

  return state;
}

/* eslint-disable @typescript-eslint/no-implied-eval */

import { evaluateInstrument } from '@opendatacapture/evaluate-instrument';
import { $AnyScalarInstrument, $FormInstrument, $InteractiveInstrument } from '@opendatacapture/schemas/instrument';
import type { AnyScalarInstrument, InstrumentKind } from '@opendatacapture/schemas/instrument';
import type { Promisable } from 'type-fest';
export type InstrumentInterpreterOptions = {
  /** An optional function to preprocess a bundle */
  transformBundle?: ((bundle: string) => Promisable<string>) | null;
};

export type InterpretOptions<TKind extends InstrumentKind> = {
  /** The value to assign to the id property of the instrument */
  id?: string;
  /** The kind of instrument being evaluated. If validate is set to true, this will be enforced at runtime. Otherwise, it will just be asserted */
  kind?: TKind;
  /** Whether to validate the structure of the instrument at runtime (expensive) */
  validate?: boolean;
};

export class InstrumentInterpreter {
  async interpret<TKind extends InstrumentKind>(
    bundle: string,
    options?: InterpretOptions<TKind>
  ): Promise<Extract<AnyScalarInstrument, { kind: TKind }>> {
    let instrument: AnyScalarInstrument;
    try {
      const value: unknown = await evaluateInstrument(bundle);
      if (!options?.validate) {
        instrument = value as Extract<AnyScalarInstrument, { kind: TKind }>;
      } else if (options.kind === 'FORM') {
        instrument = await $FormInstrument.parseAsync(value);
      } else if (options.kind === 'INTERACTIVE') {
        instrument = await $InteractiveInstrument.parseAsync(value);
      } else if (options.kind === undefined) {
        instrument = await $AnyScalarInstrument.parseAsync(value);
      } else {
        throw new Error(`Unexpected kind: ${options.kind}`);
      }
    } catch (error) {
      throw new Error(`Failed to evaluate instrument bundle`, { cause: error });
    }
    instrument.id = options?.id;
    return instrument as Extract<AnyScalarInstrument, { kind: TKind }>;
  }
}

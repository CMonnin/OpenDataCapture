import type { PrimitiveFieldValue } from '@douglasneuroinformatics/form-types';

export type FormSummaryGroupProps = {
  items: {
    label: string;
    value: PrimitiveFieldValue;
  }[];
  title: string;
};

export const FormSummaryGroup = ({ items, title }: FormSummaryGroupProps) => {
  return (
    <div className="px-4 py-5 sm:px-6">
      <h5 className="mb-2 font-medium">{title}</h5>
      <dl>
        {items.map(({ label, value }, i) => (
          <div className="my-1 sm:grid sm:grid-cols-3 sm:gap-4" key={i}>
            <dt className="text-sm font-medium text-slate-600 dark:text-slate-300">{label}</dt>
            <dd className="mt-1 text-sm text-slate-900 dark:text-slate-100 sm:col-span-2 sm:mt-0">
              {value.toString()}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};
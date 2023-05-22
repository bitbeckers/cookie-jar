import { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { FieldSpacer } from '@daohaus/form-builder';

import {
  Buildable,
  Field,
  FieldWrapper,
  WrappedInput,
  InputSelect,
} from '@daohaus/ui';

const INPUT_ID = 'periodValue';
const SELECT_ID = 'periodLength';

type PeriodLengthProps = Buildable<
  Field & {
    defaultValue?: string;
    label: string;
  }
>;

export const PeriodLength = ({
  id,
  defaultValue,
  rules,
  ...props
}: PeriodLengthProps) => {
  const { watch, register, setValue } = useFormContext();
  const [periodValue, periodMultiplier] = watch([INPUT_ID, SELECT_ID]);


  const periodSelectOpts = [
    { value: `${1}`, name: 'Seconds' },
    { value: `${60}`, name: 'Minutes' },
    { value: `${3600}`, name: 'Hours' },
    { value: `${3600 * 24}`, name: 'Days' },
  ];

  useEffect(() => {

      const extendedPeriodSeconds =
        Number(periodValue || 0) * Number(periodMultiplier || 0);
      setValue(id, extendedPeriodSeconds); 

  }, [id, periodValue, periodMultiplier, setValue]);

  return (
    <FieldWrapper {...props} id={id} rules={rules}>
      <FieldSpacer>
        <InputSelect
          {...props}
          registerInput={register(INPUT_ID, rules)}
          registerSelect={register(SELECT_ID)}
          id={INPUT_ID}
          defaultValue={defaultValue}
          selectDefault={`${3600 * 24}`}
          selectId={SELECT_ID}
          options={periodSelectOpts}
        />
      </FieldSpacer>

      <WrappedInput id={id} hidden />
    </FieldWrapper>
  );
};
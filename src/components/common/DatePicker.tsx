import React from 'react';
import { Calendar as CalendarIcon } from 'lucide-react';
import Input, { InputProps } from './Input';

export interface DatePickerProps extends Omit<InputProps, 'type' | 'leftIcon'> {
  value?: string;
  onChangeDate?: (date: string) => void;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  value,
  onChangeDate,
  onChange,
  ...props
}) => {
  return (
    <Input
      type="date"
      value={value}
      onChange={(e) => {
        onChange?.(e);
        onChangeDate?.(e.target.value);
      }}
      leftIcon={<CalendarIcon className="w-5 h-5 text-[#8E8E93]" />}
      {...props}
    />
  );
};

export default DatePicker;

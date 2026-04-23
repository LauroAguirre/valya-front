'use client'

import { forwardRef } from 'react'
import { NumericFormat, NumericFormatProps } from 'react-number-format'
import { Input } from './input'

type InputNumberProps = NumericFormatProps

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(
  ({ ...props }, ref) => {
    return (
      <NumericFormat
        getInputRef={ref}
        decimalSeparator=","
        thousandSeparator="."
        allowNegative={false}
        decimalScale={2}
        fixedDecimalScale
        customInput={Input}
        {...props}
      />
    )
  },
)

InputNumber.displayName = 'InputNumber'

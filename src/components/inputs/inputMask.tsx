'use client'

import React, { Ref } from 'react'
import { cn } from '@/lib/utils'
import { IMaskInput } from 'react-imask'

// export interface InputProps {
//   mask: MaskedPattern<string>
//   className?: string
// }

export interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value'
> {
  ref: Ref<unknown>
  mask: string
  onAccept?: (value: string, maskRef?: unknown) => void
}

export const InputMask = ({
  className,
  mask,
  onAccept,
  ...props
}: InputProps) => {
  return (
    <IMaskInput
      mask={mask}
      unmask={true}
      onBlur={props.onBlur}
      onAccept={onAccept}
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[1px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        // 'flex h-7 w-full rounded-md bg-white px-3 py-1 text-sm transition-colors',
        // 'border-slate-300 hover:shadow-md hover:shadow-slate-300',
        // // 'shadow-sm shadow-slate-500 hover:shadow-md  hover:shadow-slate-800',
        // 'placeholder:text-muted-foreground',
        // 'border-input border',
        // 'focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none',
        // 'file:border-0 file:bg-transparent file:text-sm file:font-medium',
        // 'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  )
}

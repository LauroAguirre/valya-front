import clsx from 'clsx'
import { HTMLProps } from 'react'

interface RowFormFieldsProps extends HTMLProps<HTMLDivElement> {
  children: React.ReactNode
}

export const RowFormFields = ({
  children,
  className,
  ...props
}: RowFormFieldsProps): React.ReactNode => {
  return (
    <div
      className={clsx('flex flex-1 flex-wrap justify-between gap-1', className)}
      {...props}
    >
      {children}
    </div>
  )
}

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

import { SelectProps } from '@radix-ui/react-select'
import { useMemo, useState } from 'react'
import { Input } from '../ui/input'
import { matchText } from '@/services/generic/matchText'

interface InputSelectProps extends Omit<SelectProps, 'value'> {
  id?: string
  className?: string
  placeholder?: string
  selectChange: (value: string | number) => void
  selectName?: string
  value?: string | number
  items: {
    label: string //| React.ReactNode
    value: string | number
  }[]
  filter?: boolean
  // allowClear?: boolean
  footer?: React.ReactNode
}

export const InputSelect = ({
  className,
  placeholder,
  items,
  selectChange,
  selectName,
  filter,
  // allowClear,
  footer,
  ...props
}: InputSelectProps): React.ReactNode => {
  const [filterText, setFilterText] = useState('')

  const options = useMemo(() => {
    if (!filterText || filterText === '') return items

    return items.filter(item => matchText(item.label, filterText))
  }, [items, filterText])
  return (
    <Select
      {...props}
      name={selectName}
      onValueChange={(value: string | number) => {
        setFilterText('')
        selectChange(value)
      }}
      value={props.value}
    >
      <SelectTrigger
        className={cn(
          'flex h-7 w-full flex-1 rounded-md bg-white px-3 py-1 text-sm transition-colors',
          'border-slate-300 hover:shadow-md hover:shadow-slate-300',
          // 'shadow-sm shadow-slate-500 hover:shadow-md  hover:shadow-slate-800',
          'placeholder:text-muted-foreground',
          'border-input border',
          'focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none',
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className,
        )}
      >
        <div className="flex flex-1 items-center justify-between">
          <SelectValue placeholder={placeholder} />
        </div>
      </SelectTrigger>

      <SelectContent>
        {filter && (
          <Input
            className="my-2"
            placeholder="Pesquisar..."
            onChange={e => {
              setFilterText(e.target.value)
            }}
          />
        )}
        {options.map(item => {
          return (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          )
        })}
        {options.length === 0 && (
          <div className="text-muted-foreground flex gap-2 p-2 text-sm">
            Nenhum item encontrado
          </div>
        )}
      </SelectContent>
      {footer && (
        <>
          <hr className="my-2" />
          {footer}
        </>
      )}
    </Select>
  )
}

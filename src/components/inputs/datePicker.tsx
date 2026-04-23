'use client'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useEffect, useState } from 'react'
import { Button } from '../ui/button'

import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { ControllerRenderProps, FieldValues } from 'react-hook-form'
import { IMaskInput } from 'react-imask'
import { CalendarIcon } from 'lucide-react'

interface InputDateProps
  extends
    Omit<
      React.InputHTMLAttributes<HTMLInputElement>,
      'onBlur' | 'onChange' | 'name'
    >,
    Omit<ControllerRenderProps<FieldValues>, 'value'> {
  disabledDate?: (date: Date) => boolean
}

export function DatePicker({
  className,
  disabledDate,
  ...props
}: InputDateProps) {
  // const [stringDate, setStringDate] = useState<string>('')
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [errorMessage, setErrorMessage] = useState<string>('')

  useEffect(() => {
    if (props.value) {
      setDate(new Date(props.value as string))
    } else {
      setDate(undefined)
    }
  }, [props.value])

  return (
    <Popover>
      <div className="relative w-[200px]">
        <IMaskInput
          mask="00/00/0000"
          unmask={true}
          className={cn(
            'flex h-7 w-full rounded-md bg-white px-3 py-1 text-sm transition-colors',
            'border-slate-300 hover:shadow-md hover:shadow-slate-300',
            // 'shadow-sm shadow-slate-500 hover:shadow-md  hover:shadow-slate-800',
            'placeholder:text-muted-foreground',
            'border-input border',
            'focus-visible:ring-ring focus-visible:ring-1 focus-visible:outline-none',
            'file:border-0 file:bg-transparent file:text-sm file:font-medium',
            'disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
          value={date ? format(date, 'dd/MM/yyyy') : ''}
          onChange={e => {
            // setStringDate(e.currentTarget.value)
            const { value } = e.currentTarget
            const cleanedValue = value.replace(/\D/g, '')
            if (cleanedValue.length < 8) return

            const [day, month, year] = e.currentTarget.value.split('/')
            if (!day || !month || !year) return

            const parsedDate =
              e.currentTarget.value.length > 0
                ? new Date(Number(year), Number(month) - 1, Number(day))
                : undefined

            if (parsedDate && parsedDate.toString() === 'Invalid Date') {
              setErrorMessage('Data inválida')
              setDate(undefined)
            } else {
              setErrorMessage('')
              setDate(parsedDate)
            }
          }}
          onBlur={e => {
            if (e.currentTarget.value.length === 0) {
              setDate(undefined)
              props.onChange(undefined)
              return
            }
            const [day, month, year] = e.currentTarget.value.split('/')
            props.onChange(
              new Date(Number(year), Number(month) - 1, Number(day)),
            )
          }}
        />
        {errorMessage !== '' && (
          <div className="absolute bottom-[-1.75rem] left-0 text-sm text-red-400">
            {errorMessage}
          </div>
        )}
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            className={cn(
              'absolute top-[50%] right-0 translate-y-[-50%] rounded-l-none font-normal',
              !date && 'text-muted-foreground',
            )}
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
      </div>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={selectedDate => {
            if (!selectedDate) return
            setDate(selectedDate)
            setErrorMessage('')

            props.onChange(selectedDate)
          }}
          defaultMonth={date}
          initialFocus
          disabled={disabledDate}
        />
      </PopoverContent>
    </Popover>
  )
}

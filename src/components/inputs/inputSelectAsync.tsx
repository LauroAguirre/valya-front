import React, { useEffect, useRef, useState, useCallback } from 'react'
import {
  Command,
  CommandInput,
  CommandItem,
  CommandGroup,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { useFormContext, Controller } from 'react-hook-form'
// import { ChevronsUpDown, XIcon } from 'lucide-react'
import debounce from 'lodash.debounce'
import { CaretUpDownIcon, SpinnerGapIcon, X } from '@phosphor-icons/react'
import { Tooltip } from '../generic/tooltip'
// import { Tooltip } from '../generics/tooltip'

type Item = {
  label: string
  value: string
}

type InputSelectAsyncProps = {
  name: string
  searchItems: (
    queryFilter: string,
    page: number,
  ) => Promise<{
    items: Item[]
    page: number
    totalPages: number
  }>
  placeholder?: string
  loading: boolean
  onChange?: (value: string) => void
  includeValue?: Item
  allowClear?: boolean
  footer?: React.ReactNode
  disabled?: boolean
  externalItems?: Item[]
}

export const InputSelectAsync = ({
  name,
  searchItems,
  loading,
  placeholder = 'Selecione...',
  onChange,
  includeValue,
  allowClear,
  footer,
  disabled,
  externalItems,
}: InputSelectAsyncProps) => {
  const triggerRef = useRef<HTMLButtonElement>(null)
  const [triggerWidth, setTriggerWidth] = useState<number>()
  const { control } = useFormContext()
  const [open, setOpen] = useState(false)
  const [items, setItems] = useState<Item[]>([])
  const [queryFilter, setQueryFilter] = useState('')
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const listRef = useRef<HTMLDivElement | null>(null)

  const loadItems = useCallback(
    // async (query: string, page: number, replace = false) => {
    async (query: string, page: number) => {
      if (page >= totalPages && totalPages > 0) return

      const res = await searchItems(query, page)

      const appendList = includeValue
        ? res.items.filter(item => item.value !== includeValue.value)
        : res.items

      setItems(prev => (page === 0 ? appendList : [...prev, ...appendList]))
      setPage(res.page)
      setTotalPages(res.totalPages)
    },
    [searchItems],
  )

  const debouncedSearch = useCallback(
    debounce((text: string) => {
      setPage(0)
      loadItems(text, 1)
      // loadItems(text, 1, true)
    }, 400),
    [loadItems],
  )

  useEffect(() => {
    if (!includeValue) return

    setItems(prev =>
      prev.find(item => item.value === includeValue.value)
        ? [...prev]
        : [includeValue, ...prev],
    )
  }, [includeValue])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    if (
      target.scrollTop + target.clientHeight >= target.scrollHeight - 10 &&
      !loading &&
      page < totalPages
    ) {
      loadItems(queryFilter, page + 1)
    }
  }

  useEffect(() => {
    if (open) {
      loadItems(queryFilter, 0)
      // loadItems(queryFilter, 0, true)
    }
  }, [open, queryFilter])

  useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth)
    }
  }, [open])

  return (
    <Controller
      {...control}
      name={name}
      render={({ field }) => {
        const combinedItems = [
          ...(externalItems || []),
          ...items.filter(i => !externalItems?.some(e => e.value === i.value)),
        ]
        const selected = combinedItems.find(i => i.value === field.value)
        return (
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                ref={triggerRef}
                variant="outline"
                role="combobox"
                className="w-full justify-between"
                disabled={disabled}
              >
                <span className="flex flex-1 items-start">
                  {selected?.label ?? placeholder}
                </span>
                {allowClear && selected && (
                  <Tooltip content="Limpar campo">
                    <Button
                      className="px-0"
                      variant="ghost"
                      onClick={e => {
                        e.stopPropagation()
                        onChange(null)
                      }}
                    >
                      <X size={16} className="text-slate-500" />
                    </Button>
                  </Tooltip>
                )}
                <CaretUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent style={{ width: triggerWidth }} className="p-0">
              {/* <PopoverContent className="w-[--radix-popover-trigger-width] border-2 border-red-500 p-0"> */}
              <Command>
                <CommandInput
                  placeholder="Buscar..."
                  value={queryFilter}
                  onValueChange={text => {
                    setQueryFilter(text)
                    debouncedSearch(text)
                    onChange(text)
                  }}
                />
                <CommandList
                  ref={listRef}
                  onScroll={handleScroll}
                  className="max-h-64 overflow-auto"
                >
                  <CommandGroup>
                    {combinedItems.map(item => (
                      <CommandItem
                        key={item.value}
                        onSelect={() => {
                          field.onChange(item.value)
                          onChange(item.value)
                          setOpen(false)
                        }}
                      >
                        {item.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  {loading && (
                    <div className="text-muted-foreground flex gap-2 p-2 text-sm">
                      <SpinnerGapIcon size={24} className="animate-spin" />{' '}
                      Procurando...
                    </div>
                  )}
                  {!loading && items.length === 0 && (
                    <div className="text-muted-foreground flex gap-2 p-2 text-sm">
                      Nenhum item encontrado.
                    </div>
                  )}
                </CommandList>
                {footer && (
                  <>
                    <hr />
                    {footer}
                  </>
                )}
              </Command>
            </PopoverContent>
          </Popover>
        )
      }}
    />
  )
}

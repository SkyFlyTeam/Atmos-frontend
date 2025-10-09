"use client"

import * as React from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface ComboBoxOption {
  value: string
  label: string
}

interface ComboBoxProps {
  options: ComboBoxOption[]
  value?: string
  onSelect: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  widthClass?: string
  className?: string
}

export const ComboBox: React.FC<ComboBoxProps> = ({
  options,
  value,
  onSelect,
  placeholder = "Selecionar...",
  searchPlaceholder = "Buscar...",
  emptyText = "Nenhum item encontrado.",
  widthClass = "w-[240px]",
  className,
}) => {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [visibleOptions, setVisibleOptions] = React.useState(options.slice(0, 50)) 
  const [filteredOptions, setFilteredOptions] = React.useState(options) 

  const selectedOption = options.find((o) => o.value === value)

  
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredOptions(filtered)
    setVisibleOptions(filtered.slice(0, 50)) 
  }

  const loadMoreItems = () => {
    const nextOptions = filteredOptions.slice(visibleOptions.length, visibleOptions.length + 20)
    setVisibleOptions((prev) => [...prev, ...nextOptions])
  }

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.target as HTMLElement; 
    const bottom = target.scrollHeight === target.scrollTop + target.clientHeight;
    if (bottom) {
      loadMoreItems()
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "justify-between bg-white rounded-md text-base border-gray",
            widthClass,
            className
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className={cn(widthClass, "p-0")} style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} value={searchTerm} onValueChange={handleSearch} />
          <CommandList onScroll={handleScroll}>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {visibleOptions.length === 0 ? (
                <div className="text-center py-2">{emptyText}</div>
              ) : (
                visibleOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={(val) => {
                      onSelect(val)
                      setOpen(false)
                    }}
                    className={cn(
                        value === option.value && "bg-light-green",
                    )}
                  >
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value === option.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

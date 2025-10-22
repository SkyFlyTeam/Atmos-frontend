"use client"

import * as React from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"
import SearchInput from "../SearchInput"
import { useEffect, useState } from "react"
import SearchInput from "../SearchInput"

export interface ComboBoxOption {
  value: string
  label: string
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
  disabled?: boolean
  options: ComboBoxOption[]
  value?: string
  onSelect: (value: string) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  widthClass?: string
  className?: string
  disabled?: boolean
}

export const ComboBox: React.FC<ComboBoxProps> = ({
  options,
  value,
  onSelect,
  placeholder = "Selecionar...",
  searchPlaceholder = "Buscar...",
  emptyText = "Nenhum item encontrado.",
  widthClass = "w-[10rem] max-w-[15rem] min-w-fit",
  className,
  disabled = false,
  options,
  value,
  onSelect,
  placeholder = "Selecionar...",
  searchPlaceholder = "Buscar...",
  emptyText = "Nenhum item encontrado.",
  widthClass = "w-[10rem] max-w-[15rem] min-w-fit",
  className,
  disabled = false,
}) => {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleOptions, setVisibleOptions] = useState<ComboBoxOption[]>([])
  const [filteredOptions, setFilteredOptions] = useState<ComboBoxOption[]>([])
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [visibleOptions, setVisibleOptions] = useState<ComboBoxOption[]>([])
  const [filteredOptions, setFilteredOptions] = useState<ComboBoxOption[]>([])

  const selectedOption = options.find((o) => o.value === value)
  const selectedOption = options.find((o) => o.value === value)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(term.toLowerCase())
    )
    setFilteredOptions(filtered)
    setVisibleOptions(filtered.slice(0, 50)) 
  }
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
  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.target as HTMLElement; 
    const bottom = target.scrollHeight === target.scrollTop + target.clientHeight;
    if (bottom) {
      loadMoreItems()
    }
  }

  useEffect(() => {
    setFilteredOptions(options);
    setVisibleOptions(options.slice(0, 50)); 
  }, [options]);
  useEffect(() => {
    setFilteredOptions(options);
    setVisibleOptions(options.slice(0, 50)); 
  }, [options]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
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
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
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

      <PopoverContent className={cn(widthClass, "p-0")} style={{ maxHeight: '400px', overflowY: 'auto' }} onOpenAutoFocus={(e) => e.preventDefault()}>
        <Command>
          <SearchInput placeholder={searchPlaceholder} value={searchTerm} onChange={handleSearch} className="border-none shadow-none focus-visible:ring-0"/>
          <CommandList onScroll={handleScroll}>
            <CommandGroup className="border-t-1">
              {visibleOptions.length === 0 ? (
                <CommandEmpty>{emptyText}</CommandEmpty>
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
                        "cursor-pointer"
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
      <PopoverContent className={cn(widthClass, "p-0")} style={{ maxHeight: '400px', overflowY: 'auto' }} onOpenAutoFocus={(e) => e.preventDefault()}>
        <Command>
          <SearchInput placeholder={searchPlaceholder} value={searchTerm} onChange={handleSearch} className="border-none shadow-none focus-visible:ring-0"/>
          <CommandList onScroll={handleScroll}>
            <CommandGroup className="border-t-1">
              {visibleOptions.length === 0 ? (
                <CommandEmpty>{emptyText}</CommandEmpty>
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
                        "cursor-pointer"
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

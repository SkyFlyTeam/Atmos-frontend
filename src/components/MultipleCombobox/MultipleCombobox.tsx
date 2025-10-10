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
  value?: string[] // Alterado para array de valores
  onSelect: (value: string[]) => void // Alterado para lidar com múltiplos valores
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  widthClass?: string
  className?: string
  disabled?: boolean
}

export const MultipleCombobox: React.FC<ComboBoxProps> = ({
  options,
  value = [], // Valor inicial como array
  onSelect,
  placeholder = "Selecionar...",
  searchPlaceholder = "Buscar...",
  emptyText = "Nenhum item encontrado.",
  widthClass = "w-[240px] max-w-[240px]",
  className,
  disabled = false,
}) => {
  const [open, setOpen] = React.useState(false)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [visibleOptions, setVisibleOptions] = React.useState(options.slice(0, 50))
  const [filteredOptions, setFilteredOptions] = React.useState(options)
  const selectedOptions = options.filter((o) => value.includes(o.value))

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    const filtered = options.filter((option) =>
      option.label.toLowerCase().includes(term.toLowerCase())
    )
    console.log("filtered", filtered)
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

  React.useEffect(() => {
    console.log("filteredOptions", filteredOptions);
    console.log("visibleOptions", visibleOptions);
  }, [filteredOptions, visibleOptions])

  const toggleSelect = (rawValue: string) => {
    if (rawValue === "") return;

    // Se o valor já estiver selecionado, removemos da lista
    const newValue = value.includes(rawValue) ? value.filter((v) => v !== rawValue) : [...value, rawValue];
    onSelect(newValue)
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "justify-between bg-white rounded-md text-base border-gray overflow-hidden overflow-ellipsis ",
            widthClass,
            className
          )}
        >
          {/* Exibindo valores selecionados */}
          <span className="overflow-hidden overflow-ellipsis whitespace-nowrap max-w-[220px]">{selectedOptions.length === 0 ? placeholder : selectedOptions.map((o) => o.label).join(", ")}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className={cn(widthClass, "p-0")} style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <Command>
          <CommandInput placeholder={searchPlaceholder} value={searchTerm} onValueChange={handleSearch} />
          <CommandList onScroll={handleScroll}>
            <CommandGroup>
              {visibleOptions.length === 0 ? (
                <CommandEmpty>{emptyText}</CommandEmpty>
              ) : (
                visibleOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={() => toggleSelect(option.value)} // Selecionar múltiplos itens
                    className={cn(
                      value.includes(option.value) && "bg-light-green", // Destacar valores selecionados
                    )}
                  >
                    <div className="flex flex-col">
                      <span>{option.label}</span>
                    </div>
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        value.includes(option.value) ? "opacity-100" : "opacity-0"
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

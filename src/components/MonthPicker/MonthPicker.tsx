"use client"

import * as React from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MonthYearPickerProps {
  value?: Date
  onChange: (date: Date) => void
  yearRange?: number // quantidade de anos antes e depois do atual (default: 5)
}

const months = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
]

export const MonthYearPicker: React.FC<MonthYearPickerProps> = ({
  value,
  onChange,
  yearRange = 20,
}) => {
    
  const currentDate = value ?? new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // gera anos no intervalo (ex: -5 até +5)
  const years = React.useMemo(() => {
    const start = 1990 - yearRange
    const end = currentYear + yearRange
    return Array.from({ length: end - start + 1 }, (_, i) => start + i)
  }, [currentYear, yearRange])

  const handleMonthChange = (month: string) => {
    const newMonth = Number(month)
    onChange(new Date(currentYear, newMonth, 1))
  }

  const handleYearChange = (year: string) => {
    const newYear = Number(year)
    onChange(new Date(newYear, currentMonth, 1))
  }

  return (

        <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              {/* Mês */}
              <Select
                value={String(currentMonth)}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className="w-36">
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month, index) => (
                    <SelectItem key={month} value={String(index)}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Ano */}
              <Select
                value={String(currentYear)}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className="w-24">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent className="h-64">
                  {years.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
        </div>
  )
}
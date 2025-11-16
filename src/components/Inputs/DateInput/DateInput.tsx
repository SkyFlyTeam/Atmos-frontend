import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange, isDateRange } from "react-day-picker";
import { Dispatch, SetStateAction } from "react";

type DateInputProps = {
    date: DateRange | Date | Date[];
    setDate: Dispatch<SetStateAction<any>>;
    mode: "single" | "multiple" | "range";
    disabledDates: any;
    onMonthChange?: (month: Date) => void;
};

const DateInput = ({ date, setDate, mode, disabledDates, onMonthChange }: DateInputProps) => {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!date || (Array.isArray(date) && date.length === 0)}
                    className="data-[empty=true]:text-muted-foreground w-fit flex items-start text-left font-normal bg-white border-gray-400 px-4 py-2 rounded-md"
                >
                    {(() => {
                        if (!date) {
                            if(mode === "range") {
                                return <span>Selecionar período</span>;
                            } else if (mode === "single") {
                                return <span>Selecionar data</span>;
                            } else if (mode === "multiple") {
                                return <span>Selecionar datas</span>;
                            }
                        }

                        if (mode === "range" && isDateRange(date) && date.from && date.to) {
                            const isSameDay = date.from.toDateString() === date.to.toDateString();
                            const formattedFrom = format(date.from, "dd/MM/yyyy");
                            const formattedTo = format(date.to, "dd/MM/yyyy");
                            
                            return <span>{isSameDay ? formattedFrom : `${formattedFrom} – ${formattedTo}`}</span>;
                        }

                        if (mode === "single" && date instanceof Date) {
                            return <span>{format(date, "dd/MM/yyyy")}</span>;
                        }

                        if (mode === "multiple" && Array.isArray(date) && date.length > 0) {
                            const formattedDates = date.map((d) => format(d, "dd/MM/yyyy")).join(", ");
                            return <span>{formattedDates}</span>;
                        }

                        return <span>Selecionar período</span>;
                    })()}
                    <CalendarIcon />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
                {mode === "range" && (
                    <Calendar
                        mode="range"
                        selected={isDateRange(date) ? date : undefined}
                        onSelect={setDate as any}
                        locale={ptBR}
                        disabled={disabledDates}
                        required
                        onMonthChange={onMonthChange}
                    />
                )}
                {mode === "single" && (
                    <Calendar
                        mode="single"
                        selected={date instanceof Date ? date : undefined}
                        onSelect={setDate as any}
                        locale={ptBR}
                        disabled={disabledDates}
                        required
                        onMonthChange={onMonthChange}
                    />
                )}
                {mode === "multiple" && (
                    <Calendar
                        mode="multiple"
                        selected={Array.isArray(date) ? date : []}
                        onSelect={setDate as any}
                        locale={ptBR}
                        disabled={disabledDates}
                        onMonthChange={onMonthChange}
                    />
                )}
            </PopoverContent>
        </Popover>
    );
};

export default DateInput;

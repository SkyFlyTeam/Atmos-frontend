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
};

const DateInput = ({ date, setDate, mode, disabledDates }: DateInputProps) => {
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
                                <span>Selecionar período</span>;
                            } else if (mode === "single") {
                                <span>Selecionar data</span>;
                            } else if (mode === "multiple") {
                                <span>Selecionar datas</span>;
                            }
                        }

                        if (mode === "range" && isDateRange(date) && date.from && date.to) {
                            const isSameDay = date.from.toDateString() === date.to.toDateString();
                            const formattedFrom = format(date.from, "dd/MM/yyyy", { locale: ptBR });
                            const formattedTo = format(date.to, "dd/MM/yyyy", { locale: ptBR });
                            
                            return <span>{isSameDay ? formattedFrom : `${formattedFrom} – ${formattedTo}`}</span>;
                        }

                        if (mode === "single" && date instanceof Date) {
                            return <span>{format(date, "dd/MM/yyyy", { locale: ptBR })}</span>;
                        }

                        if (mode === "multiple" && Array.isArray(date) && date.length > 0) {
                            const formattedDates = date.map((d) => format(d, "dd/MM/yyyy", { locale: ptBR })).join(", ");
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
                    />
                )}
                {mode === "multiple" && (
                    <Calendar
                        mode="multiple"
                        selected={Array.isArray(date) ? date : []}
                        onSelect={setDate as any}
                        locale={ptBR}
                        disabled={disabledDates}
                    />
                )}
            </PopoverContent>
        </Popover>
    );
};

export default DateInput;

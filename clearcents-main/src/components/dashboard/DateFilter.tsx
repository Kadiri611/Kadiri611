import { useState } from "react";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export type DateRange = {
  from: Date;
  to: Date;
};

interface DateFilterProps {
  onDateRangeChange: (range: DateRange) => void;
}

const DateFilter = ({ onDateRangeChange }: DateFilterProps) => {
  const [selectedPeriod, setSelectedPeriod] = useState("this-month");
  const [customRange, setCustomRange] = useState<{ from?: Date; to?: Date }>({});

  const handlePeriodChange = (value: string) => {
    setSelectedPeriod(value);
    
    const now = new Date();
    let from: Date, to: Date;

    switch (value) {
      case "this-month":
        from = new Date(now.getFullYear(), now.getMonth(), 1);
        to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      case "last-month":
        from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        to = new Date(now.getFullYear(), now.getMonth(), 0);
        break;
      case "last-3-months":
        from = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        to = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        break;
      default:
        return;
    }

    onDateRangeChange({ from, to });
  };

  const handleCustomRangeSelect = (range: { from?: Date; to?: Date } | undefined) => {
    if (range?.from && range?.to) {
      setCustomRange(range);
      onDateRangeChange({ from: range.from, to: range.to });
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <Select value={selectedPeriod} onValueChange={handlePeriodChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="this-month">This Month</SelectItem>
          <SelectItem value="last-month">Last Month</SelectItem>
          <SelectItem value="last-3-months">Last 3 Months</SelectItem>
          <SelectItem value="custom">Custom Range</SelectItem>
        </SelectContent>
      </Select>

      {selectedPeriod === "custom" && (
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !customRange.from && "text-muted-foreground"
              )}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              {customRange.from ? (
                customRange.to ? (
                  <>
                    {format(customRange.from, "LLL dd, y")} -{" "}
                    {format(customRange.to, "LLL dd, y")}
                  </>
                ) : (
                  format(customRange.from, "LLL dd, y")
                )
              ) : (
                <span>Pick a date range</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={customRange.from}
              selected={customRange.from && customRange.to ? { from: customRange.from, to: customRange.to } : undefined}
              onSelect={handleCustomRangeSelect}
              numberOfMonths={2}
            />
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};

export default DateFilter;
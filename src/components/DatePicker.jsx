import React, { useState } from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

function DatePickerWithRange({ className, date, setDate }) {
  const [isCalendarOpen, setCalendarOpen] = useState(false);

  const openCalendar = () => {
    setCalendarOpen(true);
  };

  const closeCalendar = () => {
    setCalendarOpen(false);
  };

  const resetDate = () => {
    setDate("");
    closeCalendar();
  };

  const handleCloseCalendar = () => {
    closeCalendar();
  };

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
            onClick={openCalendar}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "y  LLL  dd")} -{" "}
                  {format(date.to, "y  LLL  dd")}
                </>
              ) : (
                format(date.from, "y  LLL  dd")
              )
            ) : (
              <>Start Date -- End date</>
            )}
          </Button>
        </PopoverTrigger>
        <div className="flex">
          {isCalendarOpen && (
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={(newDate) => {
                  setDate(newDate);
                  // Check if both start and end dates are selected before closing the calendar
                  if (newDate.from && newDate.to) {
                    closeCalendar();
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          )}
        </div>
      </Popover>
    </div>
  );
}

export default DatePickerWithRange;

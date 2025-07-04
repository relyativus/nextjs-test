"use client";

import { ChevronDownIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatDate } from "@/lib/utils";
import { ValidationErrorLabel } from "./ValidationErrorLabel";

export function DatePicker({
  defaultValue,
  formValueName,
  label,
  errorMessages,
}: {
  defaultValue?: Date;
  formValueName: string;
  label: string;
  errorMessages?: string[];
}) {
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(undefined);

  if (defaultValue && !date) setDate(defaultValue);
  return (
    <>
      <Label htmlFor="date" className="px-1">
        {label}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            className="justify-between font-normal"
          >
            {date ? formatDate(date) : "Select date"}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      <ValidationErrorLabel errors={errorMessages} />
      <input
        type="hidden"
        name={formValueName}
        value={date ? date.toDateString() : ""}
      />
    </>
  );
}

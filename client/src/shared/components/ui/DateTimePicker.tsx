import React, { useState, useEffect, useRef } from "react";
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight } from "lucide-react";

interface DateTimePickerProps {
  label: string;
  value: string | null; // ISO string
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabledDays?: number[]; // Days of week (0-6) that are available. E.g. [1,2,3,4,5] means Mon-Fri.
  openingTime?: string; // "HH:MM" e.g. "08:00"
  closingTime?: string; // "HH:MM" e.g. "22:00"
  minDate?: Date;
}

const weekdaysShort = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function DateTimePicker({
  label,
  value,
  onChange,
  placeholder = "Select date & time",
  disabledDays,
  openingTime = "00:00",
  closingTime = "23:30",
  minDate = new Date(),
}: DateTimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parsed date states
  const parsedValue = value ? new Date(value) : null;
  const isDateValid = parsedValue && !isNaN(parsedValue.getTime());

  // Current calendar month view state
  const [viewDate, setViewDate] = useState(() => {
    return isDateValid ? new Date(parsedValue.getTime()) : new Date();
  });

  const currentYear = viewDate.getFullYear();
  const currentMonth = viewDate.getMonth();

  // Keep viewDate in sync with external value when it changes
  useEffect(() => {
    if (isDateValid) {
      setViewDate(new Date(parsedValue.getTime()));
    }
  }, [value]);

  // Click outside to close calendar popover
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Generate 30-minute intervals between opening and closing hours
  const generateTimeSlots = (): string[] => {
    const slots: string[] = [];
    const [startHour, startMin] = openingTime.split(":").map(Number);
    const [endHour, endMin] = closingTime.split(":").map(Number);

    let current = new Date();
    current.setHours(startHour, startMin, 0, 0);

    const endLimit = new Date();
    endLimit.setHours(endHour, endMin, 0, 0);

    while (current <= endLimit) {
      const hh = String(current.getHours()).padStart(2, "0");
      const mm = String(current.getMinutes()).padStart(2, "0");
      slots.push(`${hh}:${mm}`);
      current.setMinutes(current.getMinutes() + 30);
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Helper calendar calculations
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDayIndex = getFirstDayOfMonth(currentYear, currentMonth);

  // Month navigation
  const prevMonth = () => {
    setViewDate(new Date(currentYear, currentMonth - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Check if a calendar day is disabled
  const isDateDisabled = (day: number): boolean => {
    const dateToCheck = new Date(currentYear, currentMonth, day, 23, 59, 59, 999);
    
    // Past check
    if (minDate) {
      const minComparison = new Date(minDate.getTime());
      minComparison.setHours(0, 0, 0, 0);
      if (dateToCheck < minComparison) return true;
    }

    // Weekday check: if disabledDays is provided (meaning allowed days list)
    if (disabledDays && disabledDays.length > 0) {
      const dayOfWeek = new Date(currentYear, currentMonth, day).getDay();
      if (!disabledDays.includes(dayOfWeek)) {
        return true;
      }
    }

    return false;
  };

  // Select Date
  const handleDateSelect = (day: number) => {
    let baseDate: Date;
    if (isDateValid) {
      baseDate = new Date(parsedValue.getTime());
      baseDate.setFullYear(currentYear);
      baseDate.setMonth(currentMonth);
      baseDate.setDate(day);
    } else {
      baseDate = new Date(currentYear, currentMonth, day);
      // Default to opening hour or 09:00
      const [h, m] = openingTime.split(":").map(Number);
      baseDate.setHours(h || 9, m || 0, 0, 0);
    }
    
    // Ensure selected time is still valid, else adjust to opening hour
    if (openingTime || closingTime) {
      const [sh, sm] = openingTime.split(":").map(Number);
      const [eh, em] = closingTime.split(":").map(Number);
      const currentHours = baseDate.getHours();
      const currentMins = baseDate.getMinutes();
      const currentVal = currentHours * 60 + currentMins;
      const minVal = sh * 60 + sm;
      const maxVal = eh * 60 + em;

      if (currentVal < minVal || currentVal > maxVal) {
        baseDate.setHours(sh, sm, 0, 0);
      }
    }

    onChange(baseDate.toISOString());
  };

  // Select Time slot
  const handleTimeSelect = (timeStr: string) => {
    if (!isDateValid) return;
    const [hours, minutes] = timeStr.split(":").map(Number);
    const updatedDate = new Date(parsedValue.getTime());
    updatedDate.setHours(hours, minutes, 0, 0);
    onChange(updatedDate.toISOString());
    setIsOpen(false); // Close popover when fully picked
  };

  // Format display text in input box
  const formatInputText = (): string => {
    if (!isDateValid) return "";
    return parsedValue.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Generate blank blocks for calendar padding
  const renderCalendarDays = () => {
    const dayCells: React.ReactNode[] = [];

    // Padding cells from previous month
    for (let i = 0; i < firstDayIndex; i++) {
      dayCells.push(<div key={`empty-${i}`} className="h-9 w-9" />);
    }

    // Actual calendar days
    for (let day = 1; day <= daysInMonth; day++) {
      const disabled = isDateDisabled(day);
      const isSelected =
        isDateValid &&
        parsedValue.getFullYear() === currentYear &&
        parsedValue.getMonth() === currentMonth &&
        parsedValue.getDate() === day;

      dayCells.push(
        <button
          key={`day-${day}`}
          type="button"
          disabled={disabled}
          onClick={() => handleDateSelect(day)}
          className={`
            h-9 w-9 text-xs font-semibold rounded-xl flex items-center justify-center transition-all cursor-pointer select-none
            ${isSelected ? "bg-primary text-white shadow-md shadow-primary/20 scale-105" : ""}
            ${!isSelected && !disabled ? "text-foreground hover:bg-primary/10 hover:text-primary" : ""}
            ${disabled ? "text-muted/30 line-through cursor-not-allowed bg-zinc-50/50 dark:bg-zinc-800/10" : ""}
          `}
        >
          {day}
        </button>
      );
    }

    return dayCells;
  };

  return (
    <div className="space-y-1.5" ref={containerRef}>
      <label className="block text-xs font-semibold text-foreground uppercase tracking-wider">
        {label}
      </label>
      <div className="relative">
        {/* Input Toggle */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="
            w-full flex items-center justify-between bg-background border border-border rounded-xl px-4 py-3
            text-sm text-foreground text-left focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer
          "
        >
          <span className={isDateValid ? "font-semibold text-foreground" : "text-muted"}>
            {formatInputText() || placeholder}
          </span>
          <CalendarIcon size={16} className="text-muted" />
        </button>

        {/* Custom Popover */}
        {isOpen && (
          <div className="absolute right-0 left-0 sm:left-auto sm:right-0 sm:w-[480px] mt-2 bg-card border border-border shadow-xl rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-12 gap-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
            
            {/* Left: Date Picker Calendar (sm:col-span-7) */}
            <div className="sm:col-span-7 space-y-3.5 border-b sm:border-b-0 sm:border-r border-border pb-4 sm:pb-0 sm:pr-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-foreground">
                  {months[currentMonth]} {currentYear}
                </span>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={prevMonth}
                    className="p-1.5 rounded-lg border border-border hover:bg-surface text-muted hover:text-foreground transition-all cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={nextMonth}
                    className="p-1.5 rounded-lg border border-border hover:bg-surface text-muted hover:text-foreground transition-all cursor-pointer"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Weekdays */}
              <div className="grid grid-cols-7 gap-1 text-center font-bold text-[10px] text-muted uppercase">
                {weekdaysShort.map((day) => (
                  <div key={day} className="py-1">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1">
                {renderCalendarDays()}
              </div>
            </div>

            {/* Right: Scrollable 30min Time slots (sm:col-span-5) */}
            <div className="sm:col-span-5 space-y-2 flex flex-col h-[230px]">
              <div className="flex items-center gap-1.5 text-xs font-bold text-foreground border-b border-border pb-2">
                <Clock size={13} className="text-primary" />
                <span>Available Times</span>
              </div>

              {!isDateValid ? (
                <div className="flex-1 flex items-center justify-center text-[10px] text-muted text-center px-4 font-semibold">
                  Please select a date on the calendar first
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
                  {timeSlots.map((time) => {
                    const [h, m] = time.split(":").map(Number);
                    const isSelected =
                      isDateValid &&
                      parsedValue.getHours() === h &&
                      parsedValue.getMinutes() === m;

                    // Display formats e.g. "09:30 AM"
                    const displayTime = (() => {
                      const suffix = h >= 12 ? "PM" : "AM";
                      const displayH = h % 12 || 12;
                      const displayM = String(m).padStart(2, "0");
                      return `${displayH}:${displayM} ${suffix}`;
                    })();

                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => handleTimeSelect(time)}
                        className={`
                          w-full py-1.5 px-3 rounded-lg text-xs font-bold text-center border transition-all cursor-pointer
                          ${
                            isSelected
                              ? "bg-primary border-primary text-white shadow-sm"
                              : "bg-background border-border text-foreground hover:bg-primary/10 hover:text-primary hover:border-primary/30"
                          }
                        `}
                      >
                        {displayTime}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

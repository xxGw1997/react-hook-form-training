import { useEffect, useRef } from "react";
import { Button } from "./button";
import { Calendar } from "./calendar";
import { ScrollArea, ScrollBar } from "./scroll-area";

export type DateTimePickerProps = {
  date: Date;
  onDateChange: (date: Date) => void;
};

export const DateTimePicker = ({ date, onDateChange }: DateTimePickerProps) => {
  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const secondsRef = useRef<HTMLDivElement>(null);

  function handleDateSelect(date: Date | undefined) {
    if (date) {
      onDateChange(date);
    }
  }

  const scrollToPosition = (type: "hour" | "minute" | "second", top = 0) => {
    let container = null;
    if (type === "hour") {
      container = hoursRef.current;
    } else if (type === "minute") {
      container = minutesRef.current;
    } else {
      container = secondsRef.current;
    }
    container?.scrollTo({
      behavior: "smooth",
      top,
    });
  };

  const handleTimeChange = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    type: "hour" | "minute" | "second",
    value: string
  ) => {
    const currentDate = date || new Date();
    let newDate = new Date(currentDate);

    if (type === "hour") {
      newDate.setHours(parseInt(value, 10));
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    } else {
      newDate.setSeconds(parseInt(value, 10));
    }

    onDateChange(newDate);

    const button = event.currentTarget;
    scrollToPosition(type, button.offsetTop);
  };

  useEffect(() => {
    if (!date) return;
    const hour = date.getHours();
    const minute = date.getMinutes();
    const second = date.getSeconds();

    // hour
    const hoursContainer = hoursRef.current;

    // minute
    const mintuesContainer = minutesRef.current;

    // second
    const secondsContainer = secondsRef.current;

    if (!hoursContainer || !mintuesContainer || !secondsContainer) return;

    const hourCheckButtonDom = hoursContainer.querySelector(
      `button[data-hour="${hour}"]`
    ) as HTMLButtonElement;
    const minuteCheckButtonDom = mintuesContainer.querySelector(
      `button[data-minute="${minute}"]`
    ) as HTMLButtonElement;
    const secondCheckButtonDom = secondsContainer.querySelector(
      `button[data-second="${second}"]`
    ) as HTMLButtonElement;

    if (!hourCheckButtonDom || !minuteCheckButtonDom || !secondCheckButtonDom)
      return;

    scrollToPosition("hour", hourCheckButtonDom.offsetTop);
    scrollToPosition("minute", minuteCheckButtonDom.offsetTop);
    scrollToPosition("second", secondCheckButtonDom.offsetTop);
  }, [date, scrollToPosition]);

  return (
    <div className="sm:flex">
      <Calendar
        mode="single"
        selected={date}
        onSelect={handleDateSelect}
        initialFocus
      />
      <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
        <ScrollArea className="w-64 sm:w-auto" ref={hoursRef}>
          <div className="flex sm:flex-col p-2">
            {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
              <Button
                key={hour}
                size="icon"
                data-hour={hour}
                variant={date && date.getHours() === hour ? "default" : "ghost"}
                className="sm:w-full shrink-0 aspect-square"
                onClick={(e) => handleTimeChange(e, "hour", hour.toString())}
              >
                {hour}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="sm:hidden" />
        </ScrollArea>
        <ScrollArea className="w-64 sm:w-auto" ref={minutesRef}>
          <div className="flex sm:flex-col p-2">
            {Array.from({ length: 60 }, (_, i) => i).map((minute) => (
              <Button
                key={minute}
                size="icon"
                data-minute={minute}
                variant={
                  date && date.getMinutes() === minute ? "default" : "ghost"
                }
                className="sm:w-full shrink-0 aspect-square"
                onClick={(e) =>
                  handleTimeChange(e, "minute", minute.toString())
                }
              >
                {minute.toString().padStart(2, "0")}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="sm:hidden" />
        </ScrollArea>
        <ScrollArea className="w-64 sm:w-auto" ref={secondsRef}>
          <div className="flex sm:flex-col p-2">
            {Array.from({ length: 60 }, (_, i) => i).map((second) => (
              <Button
                key={second}
                size="icon"
                data-second={second}
                variant={
                  date && date.getSeconds() === second ? "default" : "ghost"
                }
                className="sm:w-full shrink-0 aspect-square"
                onClick={(e) =>
                  handleTimeChange(e, "second", second.toString())
                }
              >
                {second.toString().padStart(2, "0")}
              </Button>
            ))}
          </div>
          <ScrollBar orientation="horizontal" className="sm:hidden" />
        </ScrollArea>
      </div>
    </div>
  );
};

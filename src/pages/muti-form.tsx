import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Checkbox } from "~/components/ui/checkbox";
import { useEffect, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { format } from "date-fns";
import { cn } from "~/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "~/components/ui/calendar";
import { ScrollArea, ScrollBar } from "~/components/ui/scroll-area";

const dayPlanSchema = z.object({
  dayIndex: z.number(),
  steps: z.array(
    z.object({
      planName: z.string().min(1),
      desc: z.string(),
    })
  ),
});

const formSchema = z
  .intersection(
    z.object({
      email: z.string().email(),
      start_date: z.date(),
      isCheck: z.boolean().default(false),
    }),
    z.discriminatedUnion("mode", [
      z.object({ mode: z.literal("create") }),
      z.object({
        mode: z.literal("edit"),
        phoneNumber: z.number().min(11).max(11),
      }),
    ])
  )
  .and(
    z.union([
      z.object({ isCheck: z.literal(false) }),
      z.object({
        isCheck: z.literal(true),
        days: z.array(dayPlanSchema),
      }),
    ])
  );

type FormSchema = z.infer<typeof formSchema>;

export const MutiForm = () => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mode: "create",
    },
  });

  const isCheck = useWatch({ control: form.control, name: "isCheck" });
  const start_date = useWatch({ control: form.control, name: "start_date" });

  const {
    fields: days,
    append,
    remove,
    replace,
  } = useFieldArray({
    control: form.control,
    name: "days",
  });

  useEffect(() => {
    if (!isCheck) {
      replace([]);
      form.unregister("days");
    }
  }, [isCheck, replace, form.unregister]);

  const onSubmit = (data: FormSchema) => {
    console.log(data);
  };

  function handleDateSelect(date: Date | undefined) {
    if (date) {
      form.setValue("start_date", date);
    }
  }

  const handleTimeChange = (
    type: "hour" | "minute" | "second",
    value: string
  ) => {
    const currentDate = form.getValues("start_date") || new Date();
    let newDate = new Date(currentDate);

    if (type === "hour") {
      newDate.setHours(parseInt(value, 10));
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    } else {
      newDate.setSeconds(parseInt(value, 10));
    }

    form.setValue("start_date", newDate);
  };

  const hoursRef = useRef<HTMLDivElement>(null);
  const minutesRef = useRef<HTMLDivElement>(null);
  const secondsRef = useRef<HTMLDivElement>(null);

  const scrollToPosition = (type: "hour" | "minute" | "second") => {
    if (type === "hour") {
      hoursRef.current?.scrollTo({
        behavior: "smooth",
        top: 300,
      });
    }
  };

  useEffect(() => {
    scrollToPosition("hour");
  }, [start_date]);

  return (
    <div className="w-full h-screen flex flex-col py-12 items-center">
      <h1 className="font-bold">Muti Form</h1>
      <div className="mt-4 w-[500px]">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormDescription>This is your email.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "yyyy-MM-dd HH:mm:ss")
                          ) : (
                            <span>Start Date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="sm:flex">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={handleDateSelect}
                          initialFocus
                        />
                        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                          <ScrollArea className="w-64 sm:w-auto" ref={hoursRef}>
                            <div className="flex sm:flex-col p-2">
                              {Array.from({ length: 24 }, (_, i) => i).map(
                                (hour) => (
                                  <Button
                                    key={hour}
                                    size="icon"
                                    variant={
                                      field.value &&
                                      field.value.getHours() === hour
                                        ? "default"
                                        : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() =>
                                      handleTimeChange("hour", hour.toString())
                                    }
                                  >
                                    {hour}
                                  </Button>
                                )
                              )}
                            </div>
                            <ScrollBar
                              orientation="horizontal"
                              className="sm:hidden"
                            />
                          </ScrollArea>
                          <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                              {Array.from({ length: 60 }, (_, i) => i).map(
                                (minute) => (
                                  <Button
                                    key={minute}
                                    size="icon"
                                    variant={
                                      field.value &&
                                      field.value.getMinutes() === minute
                                        ? "default"
                                        : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() =>
                                      handleTimeChange(
                                        "minute",
                                        minute.toString()
                                      )
                                    }
                                  >
                                    {minute.toString().padStart(2, "0")}
                                  </Button>
                                )
                              )}
                            </div>
                            <ScrollBar
                              orientation="horizontal"
                              className="sm:hidden"
                            />
                          </ScrollArea>
                          <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                              {Array.from({ length: 60 }, (_, i) => i).map(
                                (second) => (
                                  <Button
                                    key={second}
                                    size="icon"
                                    variant={
                                      field.value &&
                                      field.value.getSeconds() === second
                                        ? "default"
                                        : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() =>
                                      handleTimeChange(
                                        "second",
                                        second.toString()
                                      )
                                    }
                                  >
                                    {second.toString().padStart(2, "0")}
                                  </Button>
                                )
                              )}
                            </div>
                            <ScrollBar
                              orientation="horizontal"
                              className="sm:hidden"
                            />
                          </ScrollArea>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>This is start date.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isCheck"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Yes or No</FormLabel>
                    <FormDescription>No desc.</FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <div>
              {days.map((day, index) => {
                return (
                  <div key={day.id}>
                    <span>{day.dayIndex}</span>
                    {day.steps.map((_step, idx) => {
                      return (
                        <div key={idx}>
                          <FormField
                            control={form.control}
                            name={`days.${index}.steps.${idx}.planName`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>PlanName</FormLabel>
                                <FormControl>
                                  <Input placeholder="planName" {...field} />
                                </FormControl>
                                <FormDescription>
                                  This is your plan name.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`days.${index}.steps.${idx}.desc`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Desc</FormLabel>
                                <FormControl>
                                  <Input placeholder="desc" {...field} />
                                </FormControl>
                                <FormDescription>
                                  This is your plan desc.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      );
                    })}
                    <Button
                      variant={"destructive"}
                      type="button"
                      onClick={() => remove(index)}
                    >
                      Remove all day plan
                    </Button>
                  </div>
                );
              })}
              {isCheck && (
                <Button
                  onClick={() =>
                    append({
                      dayIndex: days.length,
                      steps: Array.from({ length: 3 }).map(() => ({
                        planName: "",
                        desc: "",
                      })),
                    })
                  }
                  type="button"
                >
                  Add new plan
                </Button>
              )}
            </div>
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

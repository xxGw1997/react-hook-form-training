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
import { useEffect } from "react";

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
                console.log(days);
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

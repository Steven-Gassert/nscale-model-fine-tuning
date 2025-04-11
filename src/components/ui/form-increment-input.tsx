"use client";

import * as React from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { IncrementInput } from "@/components/ui/increment-input";
import { useFormField } from "./form";

const FormIncrementInput = React.forwardRef<
  HTMLInputElement,
  Omit<React.ComponentProps<typeof IncrementInput>, "value" | "onChange"> & {
    name: string;
    label?: string;
    description?: string;
  }
>(({ name, label, description, ...props }, ref) => {
  const { error, formDescriptionId, formMessageId } = useFormField();

  return (
    <FormField
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel>{label}</FormLabel>}
          <FormControl>
            <IncrementInput
              {...props}
              {...field}
              ref={ref}
              value={field.value}
              onChange={field.onChange}
              aria-describedby={
                !error
                  ? `${formDescriptionId}`
                  : `${formDescriptionId} ${formMessageId}`
              }
            />
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
});

FormIncrementInput.displayName = "FormIncrementInput";

export { FormIncrementInput };

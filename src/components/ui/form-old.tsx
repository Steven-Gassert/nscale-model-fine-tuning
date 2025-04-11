"use client";

/**
 * This is a modified version of the Form component from Shadcn UI.
 * It integrates with conform rather than react-hook-form however
 * You can still find examples for usage here https://ui.shadcn.com/docs/components/form#examples
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { FieldMetadata } from "@conform-to/react";

function FormDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="form-description"
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function FormMessage({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="form-message"
      className={cn("text-destructive text-sm", className)}
      {...props}
    />
  );
}

interface FormFieldProps {
  field: FieldMetadata;
  labelText: string;
  description?: string;
  control: React.ReactElement<{ name?: string }>;
}

function FormField({ field, labelText, description, control }: FormFieldProps) {
  return (
    <div className="space-y-2 mb-5">
      <Label
        htmlFor={field.name}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {labelText}
      </Label>
      {description && <FormDescription>{description}</FormDescription>}
      {React.cloneElement(control, { name: field.name })}
      {field.errors &&
        field.errors.map((error, index) => (
          <FormMessage key={index}>{error}</FormMessage>
        ))}
    </div>
  );
}

export { FormDescription, FormMessage, FormField };

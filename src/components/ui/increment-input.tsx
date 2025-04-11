"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface IncrementInputProps
  extends Omit<React.ComponentProps<"input">, "type" | "value" | "onChange"> {
  value?: number;
  onChange?: (value: number) => void;
  onlyPositive?: boolean;
  onlyIntegers?: boolean;
  step?: number;
  min?: number;
  max?: number;
}

const IncrementInput = React.forwardRef<HTMLInputElement, IncrementInputProps>(
  (
    {
      className,
      value = 0,
      onChange,
      onlyPositive = false,
      onlyIntegers = false,
      step = 1,
      min,
      max,
      ...props
    },
    ref
  ) => {
    // Internal state to handle the input value
    const [internalValue, setInternalValue] = React.useState<string>(
      value.toString()
    );

    // Helper to validate and format the numeric value
    const validateAndFormatValue = (val: string): number => {
      let numVal = onlyIntegers ? parseInt(val) : parseFloat(val);

      if (isNaN(numVal)) {
        numVal = 0;
      }

      if (onlyPositive) {
        numVal = Math.max(0, numVal);
      }

      if (min !== undefined) {
        numVal = Math.max(min, numVal);
      }

      if (max !== undefined) {
        numVal = Math.min(max, numVal);
      }

      if (onlyIntegers) {
        numVal = Math.round(numVal);
      }

      return numVal;
    };

    // Handle direct input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInternalValue(newValue);

      if (newValue === "" || newValue === "-") {
        return;
      }

      const numValue = validateAndFormatValue(newValue);
      onChange?.(numValue);
    };

    // Handle blur to format the displayed value
    const handleBlur = () => {
      const numValue = validateAndFormatValue(internalValue);
      setInternalValue(numValue.toString());
      onChange?.(numValue);
    };

    // Handle increment/decrement
    const handleIncrement = () => {
      const numValue = validateAndFormatValue(
        (parseFloat(internalValue) + step).toString()
      );
      setInternalValue(numValue.toString());
      onChange?.(numValue);
    };

    const handleDecrement = () => {
      const numValue = validateAndFormatValue(
        (parseFloat(internalValue) - step).toString()
      );
      setInternalValue(numValue.toString());
      onChange?.(numValue);
    };

    return (
      <div className="flex items-center gap-1">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9"
          onClick={handleDecrement}
          disabled={min !== undefined && parseFloat(internalValue) <= min}
        >
          -
        </Button>
        <Input
          {...props}
          ref={ref}
          type="text"
          inputMode="numeric"
          pattern={onlyIntegers ? "[0-9]*" : "[0-9]*[.]?[0-9]*"}
          value={internalValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={cn("w-12 text-center", className)}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-9"
          onClick={handleIncrement}
          disabled={max !== undefined && parseFloat(internalValue) >= max}
        >
          +
        </Button>
      </div>
    );
  }
);

IncrementInput.displayName = "IncrementInput";

export { IncrementInput };

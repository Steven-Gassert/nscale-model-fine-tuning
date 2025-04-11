import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface FormInputProps {
  title: string;
  name: string;
  description?: string;
  className?: string;
  type?: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export function FormInput({
  title,
  name,
  description,
  className = "",
  type = "text",
  placeholder,
  error,
  required = false,
}: FormInputProps) {
  const id = `form-input-${name}`;

  return (
    <div className={`space-y-2 ${className}`}>
      <Label
        htmlFor={id}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {title}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      <Input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        className={error ? "border-destructive" : ""}
        aria-describedby={description ? `${id}-description` : undefined}
        required={required}
      />

      {description && (
        <p id={`${id}-description`} className="text-sm text-muted-foreground">
          {description}
        </p>
      )}

      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}

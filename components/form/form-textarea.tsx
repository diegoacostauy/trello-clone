"use client";

import { FormErrors } from "@/components/form/form-errors";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import { forwardRef, KeyboardEventHandler } from "react";
import { useFormStatus } from "react-dom";

interface FormTextareaProps {
  id: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  onBlur?: () => void;
  onClick?: () => void;
  onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;
  defaultValue?: string;
  resize?: boolean;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      id,
      label,
      placeholder,
      required,
      disabled,
      errors,
      className,
      onBlur,
      onClick,
      onKeyDown,
      defaultValue,
    },
    ref,
  ) => {
    const { pending } = useFormStatus();

    return (
      <div className="w-full space-y-2">
        <div className="w-full space-y-1">
          {label && (
            <Label
              htmlFor={id}
              className="text-xs font-semibold text-neutral-700"
            >
              {label}
            </Label>
          )}
          <Textarea
            onKeyDown={onKeyDown}
            onClick={onClick}
            onBlur={onBlur}
            defaultValue={defaultValue}
            ref={ref}
            required={required}
            name={id}
            id={id}
            placeholder={placeholder}
            disabled={disabled || pending}
            className={cn(
              "foucs-ring-0 resize-none shadow-sm outline-none ring-0 focus-visible:ring-0 focus-visible:ring-offset-0",
              className,
            )}
            aria-describedby={`${id}-error`}
          />
        </div>
        <FormErrors id={id} errors={errors} />
      </div>
    );
  },
);

FormTextarea.displayName = "FormTextarea";

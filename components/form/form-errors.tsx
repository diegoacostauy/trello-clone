import { XCircleIcon } from "lucide-react";

interface FormErrorsProps {
  id: string;
  errors: Record<string, string[] | undefined> | undefined;
}

export function FormErrors({ id, errors }: FormErrorsProps) {
  if (!errors) return null;

  return (
    <div
      id={`${id}-error`}
      aria-live="polite"
      className="mt-2 text-xs text-rose-500"
    >
      {errors?.[id]?.map((error, index) => (
        <div
          key={error}
          className="flex items-center gap-x-1 rounded-sm border border-rose-500 bg-rose-500/10 p-2 font-medium"
        >
          <XCircleIcon className="mr-2 h-4 w-4" />
          <span>{error}</span>
        </div>
      ))}
    </div>
  );
}

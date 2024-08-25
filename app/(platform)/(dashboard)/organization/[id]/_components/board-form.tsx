"use client";

import { Button } from "@/components/ui/button";
import {createBoard} from "@/actions/create-board";
import { cn } from "@/lib/utils";
import { useFormState } from "react-dom";
import { useAction } from "@/hooks/use-action";

export default function BoardForm() {
  const { execute, isLoading, fieldErrors, error, data } = useAction(createBoard, {
    onSuccess: (data) => {
      console.log('Board created:', data);
    },
    onError: (error) => {
      console.log('Failed to create board:', error);
    }
  });

  const onSubmit = (formData: FormData) => {
    execute({
      title: formData.get('title') as string,
    });
  }

  return (
    <form action={onSubmit} className="flex gap-x-5">
      <div className="flex flex-col gap-2">
        <input
          type="text"
          name="title"
          id="title"
          required
          placeholder="Enter a board title"
          className={cn(
            "border p-1",
            fieldErrors?.title?.length
              ? "border-red-200 ring-4 ring-red-100"
              : "",
          )}
        />
        { fieldErrors?.title?.map((error, index) => (
          <div key={error} className="text-sm text-red-400">
            {error}
          </div>
        ))}
      </div>
      <Button type="submit">Create</Button>
    </form>
  );
}

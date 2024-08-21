"use client";

import { Button } from "@/components/ui/button";
import { createBoard } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { useFormState, useFormStatus } from "react-dom";

export default function BoardForm() {
  const [state, dispatch] = useFormState(createBoard, {
    message: null,
    errors: {}
  });


  return (
    <form action={dispatch} className="flex gap-x-5">
      <div className="flex flex-col gap-2">
        <input
          type="text"
          name="title"
          id="title"
          required
          placeholder="Enter a board title"
          className={cn(
            "border p-1",
            state?.errors?.title?.length
              ? "border-red-200 ring-4 ring-red-100"
              : "",
          )}
        />
        { state?.errors?.title?.map((error, index) => (
          <div key={error} className="text-sm text-red-400">
            {error}
          </div>
        ))}
      </div>
      <Button type="submit">Create</Button>
    </form>
  );
}

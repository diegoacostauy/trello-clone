"use client";

import { Button } from "@/components/ui/button";
import {createBoard} from "@/actions/create-board";
import { cn } from "@/lib/utils";
import { useFormState } from "react-dom";
import { useAction } from "@/hooks/use-action";
import FormInput from "@/components/form/form-input";
import FormSubmit from "@/components/form/form-submit";

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
      <FormInput
        label="Board title"
        id="title"
        errors={fieldErrors || {}}
      />
      <FormSubmit>
        Save
      </FormSubmit>
    </form>
  );
}

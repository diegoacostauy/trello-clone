"use client";

import { useEffect, useState } from "react";
import { unsplash } from "@/lib/unsplash";
import { Check, Loader2 } from "lucide-react";
import { useFormStatus } from "react-dom";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { defaultImages } from "@/config/constants/image";
import Link from "next/link";
import { FormErrors } from "@/components/form/form-errors";

interface FormPickerProps {
  id: string;
  errors: Record<string, string[] | undefined> | undefined;
}

export function FormPicker({ id, errors }: FormPickerProps) {
  const { pending } = useFormStatus();

  const [images, setImages] =
    useState<Array<Record<string, any>>>(defaultImages);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await unsplash.photos.getRandom({
          collectionIds: ["317099"],
          count: 9,
        });

        if (result && result.response) {
          const newImages = result.response as Array<Record<string, any>>;
          setImages(newImages);
        } else {
          console.log("Failed to get images from Unsplash");
          setImages(defaultImages);
        }
        if (result.errors) {
          console.log(result.errors);
          setImages(defaultImages);
        }
      } catch (error) {
        console.log(error);
        setImages(defaultImages);
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <ul className="mb-2 grid grid-cols-3 gap-2">
        {images.map((image) => (
          <li
            key={image.id}
            className={cn(
              "group relative aspect-square cursor-pointer bg-muted transition hover:opacity-75",
              pending && "cursor-auto opacity-50 hover:opacity-50",
            )}
            onClick={() => {
              if (pending) return;
              setSelectedImage(image.id);
            }}
          >
            {selectedImage == image.id && (
              <div className="absolute inset-y-0 z-10 flex h-full w-full items-center justify-center bg-black/30">
                <Check className="h-4 w-4 text-white" />
              </div>
            )}
            <input
              type="radio"
              name={id}
              id={id}
              value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
              className="hidden"
              checked={selectedImage == image.id}
              readOnly
              disabled={pending}
            />
            <Image
              src={image.urls.small}
              alt={image.alt_description}
              width={90}
              height={90}
              className="h-full w-full rounded-sm object-cover"
            />
            <Link
              href={image.links.html}
              target="_blank"
              className="absolute bottom-0 start-0 block w-full truncate bg-black/85 px-2 py-1 text-[10px] text-white opacity-0 hover:underline group-hover:opacity-100"
            >
              {image.user.name}
            </Link>
          </li>
        ))}
      </ul>
      {errors && <FormErrors id="image" errors={errors} />}
    </div>
  );
}

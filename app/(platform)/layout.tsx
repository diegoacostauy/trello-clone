import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { CheckCircle, XCircleIcon } from "lucide-react";

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <Toaster
        icons={{
          success: <CheckCircle />,
          error: <XCircleIcon />,
        }}
        toastOptions={{
          classNames: {
            error: "bg-red-100 text-red-700",
            success: "bg-green-100 text-green-700",
          },
        }}
      />
      {children}
    </ClerkProvider>
  );
}

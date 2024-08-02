import { Poppins } from "next/font/google";
import localFont from "next/font/local";

export const bodyFont = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: '--font-body',
});

export const headingFont = localFont({
  src: "../public/fonts/cal-sans.woff2",
  display: "swap",
  variable: '--font-heading',
});

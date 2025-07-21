import { Roboto, Roboto_Mono } from "next/font/google";

import "@syncfusion/ej2-base/styles/material.css";
import "@syncfusion/ej2-react-buttons/styles/material.css";
import "@syncfusion/ej2-react-calendars/styles/material.css";
import "@syncfusion/ej2-react-dropdowns/styles/material.css";
import "@syncfusion/ej2-react-grids/styles/material.css";
import "@syncfusion/ej2-react-navigations/styles/material.css";
import "@syncfusion/ej2-react-schedule/styles/material.css";
import "@syncfusion/ej2-react-splitbuttons/styles/material.css";
import "./globals.css";
import "./external-drag-drop.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata = {
  title: "Calendar Employee",
  description: "Register Employee Calendar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${robotoMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}

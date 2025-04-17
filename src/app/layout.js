import { Geist, Geist_Mono, Roboto, Roboto_Mono } from "next/font/google";
//import "@syncfusion/ej2-react-schedule/styles/material.css";
import "./globals.css";
import './external-drag-drop.css';

/* const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
}); */

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"], // puedes especificar pesos si quieres
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
      <body
        className={`${roboto.variable} ${robotoMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

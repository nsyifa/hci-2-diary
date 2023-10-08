import "./globals.css";
import { Inter } from "next/font/google";
import {
  PreviewContextProvider,
  DiaryContextProvider,
} from "@/context/ContextProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Digital Diary App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DiaryContextProvider>
          <PreviewContextProvider>{children}</PreviewContextProvider>
        </DiaryContextProvider>
      </body>
    </html>
  );
}

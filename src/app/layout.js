import { Vazirmatn } from 'next/font/google';
import "./globals.css";

const vazirmatn = Vazirmatn({
  subsets: ["arabic"],
});

export const metadata = {
  title: "سایت من",
  description: "توضیحات سایت من به زبان فارسی",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body className={`${vazirmatn.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
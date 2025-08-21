// [MODIFIED] FIX: Убраны клиентские провайдеры, вместо них используется компонент-обертка <Providers>.
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Providers } from "@/components/Providers"; // <-- [NEW] Импортируем обертку

const inter = Inter({ subsets: ["latin"] });

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: "Scenario — Финансовый симулятор для вашего бизнеса",
  description: "Принимайте лучшие финансовые решения с помощью нашего интерактивного симулятора. Запросите демо-версию уже сегодня!",
  openGraph: {
    title: "Scenario — Финансовый симулятор",
    description: "Интерактивная симуляция для принятия финансовых решений.",
    type: "website",
    locale: "ru_RU",
    url: appUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${inter.className} bg-white text-brand-primary`}>
        <Providers> {/* <-- [MODIFIED] Оборачиваем приложение в клиентский компонент */}
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
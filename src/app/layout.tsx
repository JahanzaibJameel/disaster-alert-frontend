import "./globals.css";
import { Inter } from "next/font/google";
import { Providers } from "./providers";
import { Toaster } from "react-hot-toast";
import { ServiceWorkerRegister } from "./ServiceWorkerRegister";
import OfflineSync from "./OfflineSync";
import { NextIntlClientProvider } from "next-intl";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
    title: "Disaster Alert & SOS",
    description: "Community-driven disaster response platform",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
                <Providers>
                    <NextIntlClientProvider>
                        <div className="flex flex-col min-h-screen">
                            {children}   {/* This will be the [locale] layout */}
                        </div>
                        <Toaster position="top-center" />
                        <ServiceWorkerRegister />
                        <OfflineSync />
                    </NextIntlClientProvider>
                </Providers>
            </body>
        </html>
    );
}
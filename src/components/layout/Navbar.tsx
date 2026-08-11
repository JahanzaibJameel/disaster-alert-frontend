"use client";
import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/useAuthStore";
import { LogIn, LogOut, User, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import useMounted from "@/hooks/useMounted";

const locales = [
    { code: "en", label: "EN" },
    { code: "es", label: "ES" },
];

export default function Navbar() {
    const t = useTranslations("common");
    const { isAuthenticated, user, login, logout } = useAuthStore();
    const { theme, setTheme } = useTheme();
    const mounted = useMounted();
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const switchLocale = (newLocale: string) => {
        // Replace the current locale in the pathname
        const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
        router.push(newPath);
    };

    return (
        <motion.nav
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="glass sticky top-0 z-50 p-4 flex justify-between items-center shadow-md"
        >
            <Link href={`/${locale}`} className="font-bold text-2xl tracking-tight">
                <span className="text-red-500">{t("brand")}</span>
            </Link>

            <div className="flex items-center gap-2">
                {/* Language Switcher */}
                <div className="flex gap-1 mr-2">
                    {locales.map(({ code, label }) => (
                        <Button
                            key={code}
                            variant={locale === code ? "default" : "ghost"}
                            size="sm"
                            onClick={() => switchLocale(code)}
                            className="text-xs"
                        >
                            {label}
                        </Button>
                    ))}
                </div>

                {/* Theme toggle */}
                {mounted ? (
                    <motion.div whileHover={{ rotate: 180 }} transition={{ duration: 0.3 }}>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            aria-label={t("toggleTheme")}
                        >
                            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>
                    </motion.div>
                ) : (
                    <div className="h-9 w-9" />
                )}

                <AnimatePresence mode="wait">
                    {isAuthenticated ? (
                        <motion.div key="auth" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex items-center gap-2">
                            <Link href={`/${locale}/profile`}>
                                <Button variant="ghost" size="sm" className="gap-2">
                                    <User className="h-4 w-4" /> {user?.name}
                                </Button>
                            </Link>
                            <Button variant="outline" size="sm" onClick={logout}>
                                <LogOut className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div key="guest" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
                            <Button variant="outline" size="sm" onClick={() => login("demo@example.com")} className="gap-2">
                                <LogIn className="h-4 w-4" /> {t("login")}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.nav>
    );
}
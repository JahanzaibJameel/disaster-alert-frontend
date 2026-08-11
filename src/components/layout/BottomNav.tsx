"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Radio, Users, Siren } from "lucide-react";
import { motion } from "framer-motion";

const links = [
    { href: "/", label: "Home", icon: Home },
    { href: "/sos", label: "SOS", icon: Siren },
    { href: "/alerts", label: "Alerts", icon: Radio },
    { href: "/community", label: "Community", icon: Users },
];

export default function BottomNav() {
    const pathname = usePathname();

    return (
        <motion.nav
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="md:hidden fixed bottom-0 left-0 right-0 glass z-50 flex justify-around p-3"
        >
            {links.map(({ href, label, icon: Icon }) => {
                const isActive = pathname === href;
                return (
                    <Link key={href} href={href} className="flex flex-col items-center relative">
                        <motion.div
                            whileTap={{ scale: 0.9 }}
                            whileHover={{ scale: 1.1 }}
                            className={`p-2 rounded-full ${isActive ? "text-red-500" : "text-muted-foreground"}`}
                        >
                            <Icon className="h-5 w-5" />
                        </motion.div>
                        {isActive && (
                            <motion.div
                                layoutId="nav-indicator"
                                className="absolute -bottom-1 h-1 w-6 bg-red-500 rounded-full"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                        <span className={`text-xs mt-1 ${isActive ? "font-semibold" : ""}`}>{label}</span>
                    </Link>
                );
            })}
        </motion.nav>
    );
}
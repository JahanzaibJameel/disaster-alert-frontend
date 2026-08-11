import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
    // Supported locales
    locales: ["en", "es"],
    // Default locale
    defaultLocale: "en",
    // Use locale prefix for default locale as well
    localePrefix: "always",
});
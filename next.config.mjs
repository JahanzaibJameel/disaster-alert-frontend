import createNextIntlPlugin from "next-intl/plugin";

const nextConfig = {
    reactStrictMode: true,
    turbopack: {},
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);

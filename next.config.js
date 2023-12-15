import withPWA from "next-pwa";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(
  "https://",
  "",
);

const config = {
  reactStrictMode: true,
  images: {
    domains: supabaseUrl ? [supabaseUrl] : [],
  },
};

const nextConfig = withPWA({
  dest: "public",
  register: true,
  disable: process.env.NODE_ENV === "development",
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /\.(png|jpg|jpeg|gif|ico|svg|webp)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "image-cache",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
        },
      },
    },
  ],
})(config);

export default nextConfig;

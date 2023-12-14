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
      urlPattern: /^https:\/\/domain\.com\/api/,
      handler: "NetworkFirst",
      options: {
        cacheName: "api-cache",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60,
        },
        networkTimeoutSeconds: 10,
      },
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg)$/,
      handler: "CacheFirst",
      options: {
        cacheName: "image-cache",
        expiration: {
          maxEntries: 500,
          maxAgeSeconds: 7 * 24 * 60 * 60,
        },
      },
    },
  ],
})(config);

export default nextConfig;

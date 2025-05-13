/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["books.google.com", "localhost"], // Cho Next.js 13 hoặc thấp hơn
    remotePatterns: [
      {
        protocol: "http",
        hostname: "books.google.com",
        port: "",
        pathname: "/books/publisher/content/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8080",
        pathname: "/api/books/image-proxy/**",
      },
    ], // Cho Next.js 14 trở lên
  },
};

module.exports = nextConfig;

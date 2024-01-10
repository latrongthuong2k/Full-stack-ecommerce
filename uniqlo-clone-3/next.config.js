/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "term-bucket-product.s3.amazonaws.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "next-app-ecommerce.s3.amazonaws.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "category-bucket-ecommerce.s3.amazonaws.com",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;

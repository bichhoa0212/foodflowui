import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  // Thêm custom basePath nếu muốn deploy app ở subpath (ví dụ: /myapp)
  // basePath: '/myapp',

  // Thêm custom rewrites cho route FE nếu muốn
  // async rewrites() {
  //   return [
  //     { source: '/san-pham/:id', destination: '/product/:id' }, // /san-pham/4 sẽ map tới /product/4
  //     // ...các rewrites khác
  //   ];
  // },
  async rewrites() {
    return [
      // Custom FE rewrite: /san-pham/4 => /product/4
      { source: '/san-pham/:id', destination: '/product/:id' },
      // API rewrite (giữ lại)
      {
        source: "/api/:path*",
        destination: "http://localhost:8080/api/:path*",
      },
    ];
  },
  // Cho phép truy cập dev từ các IP mạng LAN (fix Cross origin request detected)
  allowedDevOrigins: [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://192.168.21.26:3000',
  ],
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api",
    APP_SECRET_KEY: process.env.APP_SECRET_KEY || "793ddabd7c83070cd1ac72877edd9d29",
    JWT_SECRET: process.env.JWT_SECRET || "793ddabd7c83070cd1ac72877edd9d29",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "793ddabd7c83070cd1ac72877edd9d29",
    NEXT_PUBLIC_ENVIRONMENT: process.env.NEXT_PUBLIC_ENVIRONMENT || "development",
    NEXT_PUBLIC_ENABLE_DEBUG: process.env.NEXT_PUBLIC_ENABLE_DEBUG || "true",
    NEXT_PUBLIC_ENABLE_LOGGING: process.env.NEXT_PUBLIC_ENABLE_LOGGING || "true",
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@neuravolt/ui", "@neuravolt/auth", "@neuravolt/database"],
};

export default nextConfig;

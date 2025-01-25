import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  env: {
    NEXT_PUBLIC_ASTRA_DB_ENDPOINT: process.env.NEXT_PUBLIC_ASTRA_DB_ENDPOINT,
    NEXT_PUBLIC_ASTRA_DB_APPLICATION_TOKEN: process.env.NEXT_PUBLIC_ASTRA_DB_APPLICATION_TOKEN,
    JINA_API_KEY: process.env.JINA_API_KEY,
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY
  }
};

export default nextConfig;

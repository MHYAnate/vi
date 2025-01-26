import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = {
  env: {
    ASTRA_DB_ENDPOINT: process.env.ASTRA_DB_ENDPOINT,
    ASTRA_DB_APPLICATION_TOKEN: process.env.ASTRA_DB_APPLICATION_TOKEN,
    JINA_API_KEY: process.env.JINA_API_KEY,
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY
  }
};

export default nextConfig;

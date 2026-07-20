import type { NextConfig } from "next";

const TESTNET_CONTRACTS = {
  NEXT_PUBLIC_CONTRACT_DATASET_REGISTRY:
    "CBET4YWSMIZB3LGLVTDKQJ5HXQAPQGM3NKGXJLJEJQNF7TBDOVMXUOK",
  NEXT_PUBLIC_CONTRACT_LICENSE_ROUTER:
    "CAQPZ5IK3WSHZTRQUAEKK3GMVKHSMWUFMJ4RFBOQ2QYQAUWK2TGZJMK",
  NEXT_PUBLIC_CONTRACT_ROYALTY_SPLITTER:
    "CBQPFV7LQRSQOJTLXE7LIQXZSPJHBV7LQYSVYUUQZFJTJDZMUFKGQHJ",
  NEXT_PUBLIC_CONTRACT_QUALITY_ORACLE:
    "CCJVLNJ5O4NHIFMJMYZRFYIBRFM3WS7BKGYGWIQXNQYFXQTUYAEZQR5",
  NEXT_PUBLIC_CONTRACT_DATA_COMMISSION:
    "CDTGZ2PFUODWQFKLCMF2XZ7NY2HQPJFN3BQKUOIYRBKL5VWKRQBZLMJ",
};

// Build-time env: use whatever is already set in the environment (CI, Vercel,
// .env.local), falling back to the known testnet addresses so the banner
// renders correctly in development and CI without a .env.local file.
const env: Record<string, string> = {};
for (const [key, fallback] of Object.entries(TESTNET_CONTRACTS)) {
  env[key] = process.env[key] ?? fallback;
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  webpack(config, { webpack }) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve("buffer/"),
    };
    config.plugins.push(
      new webpack.ProvidePlugin({ Buffer: ["buffer", "Buffer"] })
    );
    return config;
  },
};

export default nextConfig;

import type { NextConfig } from 'next';

// GitHub Pages hosts this repo under /Romance-Trio, not at the domain root.
// Local `npm run dev` continues to work at http://localhost:3000/.
const onGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  reactStrictMode: true,
  ...(onGitHubPages ? { basePath: '/Romance-Trio' } : {}),
};

export default nextConfig;

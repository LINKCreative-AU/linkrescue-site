/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // ONE PRIVACY POLICY FOR THE GROUP (James, 4 Sep 2026: "redirect all 7
      // child sites to link.com.au main policy"). Seven divisions publishing
      // seven statements about how LINK handles personal information is seven
      // documents to keep in step, and they had already drifted.
      { source: "/privacy", destination: "https://link.com.au/privacy", permanent: true },
    ];
  },
};

export default nextConfig;

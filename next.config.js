module.exports = {
  async headers() {
    return [
      {
        source: "/3js/bedroom-shelf/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, nosnippet, noimageindex" },
          { key: "Referrer-Policy", value: "no-referrer" },
        ],
      },
      {
        source: "/3d-modeling/self/:path*",
        headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }],
      },
      {
        source: "/tools/:path*",
        headers: [
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive, nosnippet, noimageindex" },
          // same-origin, not no-referrer: Server Actions reject the `Origin: null` that no-referrer causes.
          { key: "Referrer-Policy", value: "same-origin" },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/3js/bedroom-shelf",
        destination: "/3js/bedroom-shelf/index.html",
      },
      // Private tools live in their own Vercel projects, served under /tools via basePath.
      {
        source: "/tools/mealplan",
        destination: "https://mealplan-hazel-two.vercel.app/tools/mealplan",
      },
      {
        source: "/tools/mealplan/:path*",
        destination: "https://mealplan-hazel-two.vercel.app/tools/mealplan/:path*",
      },
    ];
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

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
    ];
  },
  async rewrites() {
    return [
      {
        source: "/3js/bedroom-shelf",
        destination: "/3js/bedroom-shelf/index.html",
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

module.exports = {
  async rewrites() {
    return [
      {
        source: "/3d-modeling/self",
        destination: "/3d-modeling/self/index.html",
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

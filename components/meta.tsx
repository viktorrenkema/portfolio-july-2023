import Head from "next/head";

const title = "Viktor — Software engineer";
const description = "Software engineer based in Amsterdam.";

export default function Meta() {
  return (
    <Head>
      <title>{title}</title>

      <link rel="icon" href="/images/favicon.png" type="image/x-icon" />

      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://www.viktorrenkema.com/" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta
        property="og:image"
        content="https://framerusercontent.com/images/uk493UmQNuW1PwtAhLrt3cD8alg.png"
      />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@vrenkema" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta
        name="twitter:image"
        content="https://framerusercontent.com/images/uk493UmQNuW1PwtAhLrt3cD8alg.png"
      />
    </Head>
  );
}

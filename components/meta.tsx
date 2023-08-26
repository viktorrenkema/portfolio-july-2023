import Head from "next/head";

const title = "Viktor — Software Engineer";
const description = "Software engineer based in Amsterdam.";
// const image = '/images/meta-image.png'
const image =
  "https://framerusercontent.com/images/9uO8ulDbH8taxFAwjC0gjZeQ.png";

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
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@vrenkema" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Head>
  );
}

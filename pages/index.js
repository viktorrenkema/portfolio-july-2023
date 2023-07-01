import Head from "next/head";
import styled from "styled-components";

const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
`;

export default function Home() {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <FlexColumn>
          <h1>Viktor Renkema</h1>
          <p>Software Engineer</p>
        </FlexColumn>
      </main>
      <footer></footer>
    </div>
  );
}

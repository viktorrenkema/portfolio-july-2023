import styled from "styled-components";
import Headline from "../components/headline";
import Meta from "../components/meta";
import { motion } from "framer-motion";
import { H1, H2 } from "../components/typography/headings";
import { Carousel } from "../components/Carousel";

const Main = styled(motion.main)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StickyContainer = styled(motion.div)`
  min-height: 550vh;
  max-width: 100vw;
  width: 100%;
  overflow: clip;
`;

const CompaniesContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5rem;
  position: sticky;
  top: 10%;
`;

const FlexRow = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

export default function Home() {
  return (
    <div>
      <Meta />
      <Main>
        <Headline />

        <StickyContainer>
          <CompaniesContainer>
            <H2>I worked on some pretty amazing teams.</H2>
            <Carousel />
          </CompaniesContainer>
        </StickyContainer>

        <div style={{ height: "1000px" }}></div>
        <div style={{ height: "1000px" }}></div>
      </Main>
    </div>
  );
}

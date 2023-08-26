import { motion } from "framer-motion";
import React from "react";
import { styled } from "styled-components";
import { H1, Paragraph } from "./reusable/typography";
import { device, radius, space } from "../styles/theme";
import { InlineHyperlink } from "./inline-hyperlink";

const BackgroundContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 8rem;
  position: relative;
  padding: 0 10%;

  @media ${device.tablet} {
    padding: unset;
    width: 50%;
    max-width: 650px;
  }
`;

const ParagraphsContainer = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${space[8]};

  p {
    text-align: center;
  }
`;

export const AboutMe = ({ item }) => {
  return (
    <BackgroundContainer>
      <H1 variants={item}>Things I built</H1>
      <ParagraphsContainer>
        <Paragraph>
          I pursued a degree in Psychology, and only after joining{" "}
          <InlineHyperlink href="https://www.framer.com">
            Framer
          </InlineHyperlink>{" "}
          I started learning code.
        </Paragraph>
        <Paragraph>
          Below are some projects that taught me a lot along the way.
        </Paragraph>
      </ParagraphsContainer>
    </BackgroundContainer>
  );
};

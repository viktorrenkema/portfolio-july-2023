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
    max-width: 600px;
  }
`;

const ParagraphsContainer = styled(motion.div)`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${space[12]};

  p {
    text-align: center;
  }
`;

const Outer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  cursor: pointer;
  gap: 1rem;
  height: 180px;
  width: 100%;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  padding: 0rem 1rem 0rem 0rem;
  border-radius: ${radius.md};
  margin-block: 1rem;
`;

const Brains = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  transform: rotate(-15deg);
  position: absolute;
  left: -45px;
  top: -120px;

  @media ${device.tablet} {
    left: -45px;
    top: -125px;
  }
`;

const BrainGroup = styled(motion.div)`
  display: flex;
`;

const Details = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: ${space[4]};
  z-index: 2;
`;

interface EmojiProps {
  size: BrainSizes;
}

const EmojiWrapper = styled(motion.div)`
  padding: 0.2rem;

  @media ${device.tablet} {
    padding: 0.5rem;
  }

  @media ${device.laptopM} {
    padding: 0.5rem;
  }
`;

const EmojiEl = styled(Paragraph)<EmojiProps>`
  white-space: nowrap;
  font-size: ${({ size }) =>
    size === "s"
      ? "1rem"
      : size === "m"
      ? "2rem"
      : size === "l"
      ? "3rem"
      : "4rem"};
  display: ${({ size }) => (size === "xl" ? "none" : "block")};
  cursor: pointer;

  @media ${device.tablet} {
    display: block;
  }
`;

type BrainSizes = "s" | "m" | "l" | "xl";

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

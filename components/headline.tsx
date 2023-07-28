import styled from "styled-components";
import { motion } from "framer-motion";
import SocialButton from "./social-button";
import { Avatar } from "./avatar";
import { H1 } from "./typography/headings";
import { device } from "../styles/theme";

const StyledH1 = styled(H1)``;

const Paragraph = styled(motion.p)`
  font-size: 1rem;
  margin-block-start: 0.5em;
  text-align: center;
  color: #646464;
  width: 60%;

  @media ${device.mobile} {
    width: 100%;
  }
`;

export const Gradient = styled(motion.div)`
  background: url("/images/gradients/yellow-orange-red.png") no-repeat center
    center;
  width: 180vw;
  height: 100vh;
  background-size: contain;
  position: absolute;
  z-index: -1;

  @media ${device.tablet} {
    width: 150vw;
  }

  @media ${device.laptopL} {
    width: 100vw;
  }
`;

const HeadlineContainer = styled(motion.div)`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  overflow: visible;
  z-index: 1;
`;

const FlexColumn = styled(motion.div)`
  display: flex;
  flex-direction: column;
  margin-left: auto;
  margin-right: auto;
  max-width: 720px;
  align-items: center;
`;

const FlexRow = styled(motion.div)`
  display: flex;
  margin-top: 1rem;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`;

const variants = {
  initial: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Headline() {
  return (
    <HeadlineContainer>
      <FlexColumn>
        <Avatar
          animate="show"
          variants={variants}
          initial="initial"
          transition={{ duration: 0.75 }}
        />
        <StyledH1
          animate="show"
          variants={variants}
          initial="initial"
          transition={{ duration: 0.75, delay: 0.25 }}
        >
          Hey, I'm Viktor.
        </StyledH1>
        <Paragraph
          animate="show"
          variants={variants}
          initial="initial"
          transition={{ duration: 0.75, delay: 0.5 }}
        >
          Software engineer based in Amsterdam.
        </Paragraph>
      </FlexColumn>
      <FlexRow>
        <SocialButton text="twitter" url="https://www.twitter.com/vrenkema" />
        <SocialButton
          text="linkedin"
          url="https://www.linkedin.com/in/viktor-renkema-7b3505133/"
        />
        <SocialButton text="github" url="https://github.com/viktorrenkema" />
        <SocialButton text="email" url="mailto:vrenkema@gmail.com" />
      </FlexRow>
      {/* <Gradient /> */}
    </HeadlineContainer>
  );
}

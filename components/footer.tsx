import styled from "styled-components";
import { Paragraph } from "./reusable/typography";
import { ArrowInCircle } from "./reusable/icons";
import { motion, useInView } from "framer-motion";
import React, { useRef } from "react";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.5,
      duration: 0.5,
      ease: "easeIn",
    },
  },
};

const item = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeIn",
    },
  },
};

const Container = styled(motion.footer)`
  display: flex;
  width: 100%;
  height: 100px;
  align-items: center;
  justify-content: center;
  margin: 1rem 0 2rem 0;
`;

const CTA = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  gap: 1rem;
`;

const Texts = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const LinkIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: fit-content;
  height: fit-content;
`;
const colors = [
  "rgb(94, 94, 94, 0.5)",
  "rgb(94, 94, 94, 0.25)",
  "rgb(94, 94, 94, 0.15)",
];

const arrowVariants = {
  hover: {
    boxShadow: `${colors[1]} 0px 0px 0px 3px, ${colors[2]} 0px 0px 0px 5px`,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
  default: {
    boxShadow: `${colors[1]} 0px 0px 0px 0px, ${colors[2]} 0px 0px 0px 0px`,
  },
};

const StyledArrowInCircle = styled(ArrowInCircle)`
  transform: rotate(270deg);
`;

export default function Footer() {
  const [hovered, setHovered] = React.useState(false);
  const ref = useRef();
  const isInView = useInView(ref, { amount: 0.1 });

  const handleClick = () => {
    return window.scrollTo({
      top: 0,
      behavior: "smooth", // smooth scroll
    });
  };

  return (
    <Container>
      <CTA
        onHoverStart={() => {
          setHovered(true);
        }}
        onHoverEnd={() => {
          setHovered(false);
        }}
        onClick={handleClick}
        variants={container}
        animate={isInView ? "show" : "hidden"}
        initial="hidden"
        ref={ref}
      >
        {" "}
        <Texts>
          <Paragraph variants={item} color="rgb(94 94 94)">
            That's all for now.
          </Paragraph>
          <Paragraph variants={item} color="#9b9b9b">
            Feel free to contact me with any questions
          </Paragraph>
        </Texts>
        <motion.div variants={item}>
          {" "}
          <LinkIndicator
            variants={arrowVariants}
            animate={hovered ? "hover" : "default"}
            initial="default"
          >
            <StyledArrowInCircle colors={colors} large />
          </LinkIndicator>
        </motion.div>
      </CTA>
    </Container>
  );
}

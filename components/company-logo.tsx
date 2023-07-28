import styled from "styled-components";
import { Variants, motion } from "framer-motion";
import React from "react";
import { Arrow, ArrowRounded } from "./reusable/icons";

const Container = styled(motion.div)`
  display: flex;
  align-items: center;
  border-radius: 50%;
  gap: 1rem;
`;

interface LogoBackgroundProps {
  tint: string;
  children: React.JSX.Element;
}

const LogoBackground = styled(motion.div)<LogoBackgroundProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border-radius: 50%;
  width: 250px;
  height: 90px;
`;

const LinkIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: fit-content;
  height: fit-content;
  position: absolute;
  right: ${({ iconOffset }) => `${iconOffset}px`};
  pointer-events: ${({ active }) => (active ? "auto" : "none")};
  top: 33px;
`;

const colors = {
  ticketswap: [
    "rgb(0, 153, 255, 1)",
    "rgb(0, 153, 255, 0.5)",
    "rgb(0, 153, 255, 0.25)",
  ],
  gitbook: [
    "rgb(144, 176, 255, 1)",
    "rgb(144, 176, 255, 0.5)",
    "rgb(144, 176, 255, 0.25)",
  ],
  framer: ["rgb(0, 0, 0, 1)", "rgb(0, 0, 0, 0.25)", "rgb(0, 0, 0, 0.10)"],
};

interface Props {
  initial: string;
  animate: string;
  variants: Variants;
  logo: React.JSX.Element;
  linkColor: string;
  iconOffset: number;
  link: string;
  company: "ticketswap" | "framer" | "gitbook";
}

export default function CompanyLogo({
  logo,
  animate,
  variants,
  initial,
  iconOffset,
  link,
  company,
}: Props) {
  const [hovered, setHovered] = React.useState(false);

  const arrowVariants = {
    hover: {
      boxShadow: `${colors[company][1]} 0px 0px 0px 3px, ${colors[company][2]} 0px 0px 0px 5px`,
      transition: {
        duration: 0.5,
        ease: "easeIn",
      },
    },
    default: {
      boxShadow: `${colors[company][1]} 0px 0px 0px 0px, ${colors[company][2]} 0px 0px 0px 0px`,
    },
  };

  console.log(company, hovered);

  return (
    <motion.a target="_blank" href={link}>
      <Container
        variants={variants}
        animate={animate}
        initial={initial}
        onHoverStart={() => {
          setHovered(true);
        }}
        onHoverEnd={() => {
          setHovered(false);
        }}
      >
        <LogoBackground>{logo}</LogoBackground>
        <LinkIndicator
          animate={hovered ? "hover" : "default"}
          iconOffset={iconOffset}
          variants={arrowVariants}
          initial="default"
        >
          <ArrowRounded colors={colors} company={company} />
        </LinkIndicator>
      </Container>
    </motion.a>
  );
}

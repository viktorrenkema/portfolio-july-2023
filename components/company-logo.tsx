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
  width: 30px;
  height: 30px;
  position: absolute;
  right: ${({ iconOffset }) => `${iconOffset}px`};
  pointer-events: ${({ active }) => (active ? "auto" : "none")};
  top: 30px;
`;

interface Props {
  initial: string;
  animate: string;
  variants: Variants;
  logo: React.JSX.Element;
  linkColor: string;
  iconOffset: number;
  link: string;
}

export default function CompanyLogo({
  logo,
  animate,
  variants,
  initial,
  linkColor,
  iconOffset,
  link,
}: Props) {
  const [hovered, setHovered] = React.useState(false);

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
          animate={hovered ? { opacity: 1, x: 10 } : { opacity: 0, x: 0 }}
          iconOffset={iconOffset}
        >
          <ArrowRounded color={linkColor} />
        </LinkIndicator>
      </Container>
    </motion.a>
  );
}

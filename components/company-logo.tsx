import styled from "styled-components";
import { Variants, motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { ArrowRounded } from "./reusable/icons";
import useViewport from "./hooks/useViewport";

const Container = styled(motion.div)`
  display: flex;
  align-items: center;
  border-radius: 50%;
  gap: 4rem;
  position: relative;
`;

const LogoBackground = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 1rem;
  border-radius: 50%;
  height: fit-content;
`;

const LinkIndicator = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: fit-content;
  height: fit-content;
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
  logo: React.JSX.Element[];
  link: string;
  company: "ticketswap" | "framer" | "gitbook";
  setActiveCompany: (company: string) => void;
}

export default function CompanyLogo({
  initial,
  animate,
  variants,
  logo,
  link,
  company,
  setActiveCompany,
}: Props) {
  const [hovered, setHovered] = React.useState(false);
  const elementRef = useRef(null);
  const { isMobile } = useViewport();

  const arrowVariants = {
    hover: {
      boxShadow: `${colors[company][1]} 0px 0px 0px 3px, ${colors[company][2]} 0px 0px 0px 5px`,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
    default: {
      boxShadow: `${colors[company][1]} 0px 0px 0px 0px, ${colors[company][2]} 0px 0px 0px 0px`,
    },
  };

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const element = elementRef.current;
        const { left, right } = element.getBoundingClientRect();
        const windowWidth =
          window.innerWidth || document.documentElement.clientWidth;

        const leftTwentyPercent = windowWidth * (isMobile ? 0.1 : 0.22);

        console.log({ isMobile });

        // Check if the element has passed the left 20% edge of the viewport on the x-axis
        if (left <= leftTwentyPercent && right >= leftTwentyPercent) {
          setActiveCompany(company);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.a target="_blank" href={link} ref={elementRef}>
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
        <LogoBackground>
          {logo[isMobile ? "mobile" : "desktop"]}
          <LinkIndicator
            animate={hovered ? "hover" : "default"}
            variants={arrowVariants}
            initial="default"
          >
            <ArrowRounded colors={colors} company={company} />
          </LinkIndicator>
        </LogoBackground>
      </Container>
    </motion.a>
  );
}

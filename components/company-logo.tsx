import styled from "styled-components";
import { Variants, motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import { ArrowRounded } from "./reusable/icons";

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
  height: 90px;
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
  logo: React.JSX.Element;
  linkColor: string;
  link: string;
  company: "ticketswap" | "framer" | "gitbook";
}

export default function CompanyLogo({
  logo,
  animate,
  variants,
  initial,
  link,
  company,
  setActiveCompany,
}: Props) {
  const [hovered, setHovered] = React.useState(false);
  const elementRef = useRef(null);

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

        const leftTwentyPercent = windowWidth * 0.2;

        if (company === "framer") {
          console.log(left, right, leftTwentyPercent);
        }
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
    <motion.a
      target="_blank"
      href={link}
      ref={elementRef}
      // style={{ border: "1px solid maroon" }}
    >
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
          {logo}
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

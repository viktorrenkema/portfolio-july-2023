import styled from "styled-components";
import {
  motion,
  useInView,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { H2, Paragraph } from "./reusable/typography";
import Image from "next/image";
import { Arrow } from "./reusable/icons";
import {
  colors,
  device,
  fontSize,
  fontWeight,
  radius,
  shadows,
  space,
} from "../styles/theme";
import useViewport from "./hooks/useViewport";
import { InlineHyperlink } from "./inline-hyperlink";

const Container = styled(motion.div)`
  display: flex;
  flex: none;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: center;
  background: #f7f7f7;
  height: auto;
  box-shadow: ${shadows.large};
  padding: 0.35rem;
  gap: ${space[24]};
  width: 100vw;
  max-width: 1440px;
  overflow: visible;
  position: relative;
  user-select: none;
  z-index: 3;
  border-radius: ${radius["xl"]};
  background: #ffffff4a;
`;

const StyledImage = styled(Image)`
  object-fit: cover;
  object-position: left 0%;
`;

const OutterContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Column = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  max-width: 1030px;
`;

interface ImageContainerProps {
  $height: number;
}

const ImageContainer = styled(motion.div)<ImageContainerProps>`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  backdrop-filter: blur(2px);
  border-radius: ${radius["lg"]};
  overflow: hidden;
  position: relative;
  height: ${({ $height }) => `${$height}px`};
  max-height: 710px;
`;

const StyledParagraph = styled(Paragraph)`
  text-align: center;
  width: 90%;

  @media ${device.tablet} {
    width: 60%;
  }
`;

const Hyperlink = styled(motion.a)`
  color: rgb(0, 153, 255, 1);
  font-size: ${fontSize[14]};
  display: flex;
  gap: 5px;
  align-items: center;
  margin-top: auto;
  padding: ${space[4]} ${space[8]};
  border-radius: ${radius["md"]};
`;

const LinkStaggerWrapper = styled(motion.div)`
  margin-top: 0.25rem;
`;

const container = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.5,
      duration: 0.5,
      ease: "easeIn",
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeIn",
    },
  },
};

const hyperlinkVariants = {
  hover: {
    background: "rgb(0, 153, 255, 0.1)",
    border: "0px solid rgb(0, 153, 255, 0.25)",
    boxShadow: `0 0 0 2px rgb(0, 153, 255, 0.5), 0 0 0 4px rgb(0, 153, 255, 0.25)`,
  },
  show: {
    opacity: 1,
    y: 0,
    background: "#0055ff00",
    boxShadow: `0 0 0 0px rgb(0, 153, 255, 0), 0 0 0 0px rgb(0, 153, 255, 0.25)`,
    transition: {
      duration: 0.5,
      ease: "easeIn",
    },
  },
};

interface Props {
  asset: string;
  title: string;
  alt: string;
  firstDescription: string;
  secondDescription?: string;
  link?: string;
  linkText?: string;
  id: "ticketswap" | "invoicer" | "workout";
}

export default function ProjectCard({
  asset,
  title,
  firstDescription,
  secondDescription,
  link,
  alt,
  linkText,
  id,
}: Props) {
  const { scrollYProgress } = useScroll();
  const [startAndEndOfSticky, setStartAndEndOfSticky] = useState([0, 0]);
  const [isAboveThreshold, setIsAboveThreshold] = useState(false);
  const { calculatedImageHeight } = useViewport();
  const ref = useRef();
  const isProjectsInView = useInView(ref, { amount: 0.1 });
  const [hovered, setHovered] = useState(false);
  const [imageHeight, setImageHeight] = useState(0);

  const scaleTransform = useTransform(
    scrollYProgress,
    [startAndEndOfSticky[0] + 0.1, startAndEndOfSticky[1]],
    [0.5, 0.9]
  );

  const opacityTransform = useTransform(
    scrollYProgress,
    [startAndEndOfSticky[0] - 0.1, startAndEndOfSticky[1]],
    [0, 1]
  );

  const scale = useMotionTemplate`${scaleTransform}`;

  useEffect(() => {
    const refElement = ref.current;
    const { top, height } = refElement.getBoundingClientRect();

    const documentHeight =
      document.documentElement.scrollHeight || document.body.scrollHeight;

    const refPercentageStart = top / (documentHeight - height) - 0.3;
    const refPercentageEnd = (top + height) / documentHeight;

    setStartAndEndOfSticky([refPercentageStart, refPercentageEnd]);

    // Add listener to the scrollYProgress to check if the trigger is passed to display the details
    const checkForThreshold = () => {
      if (scaleTransform.get() > 95) {
        setIsAboveThreshold(true);
      }
      if (scaleTransform.get() < 95) {
        setIsAboveThreshold(false);
      }
    };

    scrollYProgress.on("change", checkForThreshold);

    // Cleanup the event listener when the component unmounts
    return () => {
      scrollYProgress.on("change", checkForThreshold);
    };
  }, [imageHeight]);

  // Somehow passing the `height` from the useViewport hook directly to <ImageContainer/> caused
  // an issue where all css styles of the styled components were not injected into the DOM. If I
  // have time, I will look into this issue.
  useEffect(() => {
    setImageHeight(calculatedImageHeight);
  }, [calculatedImageHeight]);

  return (
    <OutterContainer style={{ opacity: opacityTransform }} ref={ref}>
      <Column
        variants={container}
        animate={isProjectsInView ? "show" : "hidden"}
        initial="hidden"
      >
        <H2 variants={item}>{title}</H2>
        <StyledParagraph variants={item}>{firstDescription}</StyledParagraph>
        {secondDescription && (
          <StyledParagraph variants={item}>{secondDescription}</StyledParagraph>
        )}
        {link && (
          <LinkStaggerWrapper variants={item}>
            {/* <InlineHyperlink href={link}>{linkText}</InlineHyperlink> */}
            <Hyperlink
              target="_blank"
              href={link}
              onHoverStart={() => setHovered(true)}
              onHoverEnd={() => setHovered(false)}
              variants={hyperlinkVariants}
              animate={hovered ? "hover" : "show"}
            >
              {linkText}
              <Arrow hovered={hovered} />
            </Hyperlink>
          </LinkStaggerWrapper>
        )}
      </Column>

      <Container style={{ scale }}>
        <ImageContainer $height={imageHeight}>
          <StyledImage
            alt={alt}
            src={asset}
            layout="fill"
            style={{ objectFit: "contain" }}
          />
        </ImageContainer>
      </Container>
    </OutterContainer>
  );
}

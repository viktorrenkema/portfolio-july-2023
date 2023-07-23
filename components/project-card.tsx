import styled from "styled-components";
import {
  motion,
  useInView,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { H2 } from "./typography/headings";
import Image from "next/image";
import { Paragraph } from "./typography/paragraphs";
import { Arrow } from "./reusable/icons";

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: #f7f7f7;
  height: auto;
  box-shadow: rgba(0, 0, 0, 0.07) 2.2px 2.2px 16.9px,
    rgba(0, 0, 0, 0.067) 5.1px 5.1px 44.4px, rgba(0, 0, 0, 0.07) 10px 10px 136px;
  padding: 2rem;
  //
  display: flex;
  flex: none;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 20px;
  /* height: 828px; */
  justify-content: center;
  width: 100vw;
  max-width: 1440px;
  overflow: visible;
  padding: 4px;
  position: relative;
  user-select: none;
  z-index: 3;
  border-radius: 14px;
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
`;

export const ImageContainer = styled(motion.div)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  backdrop-filter: blur(2px);
  border-radius: 12px;
  overflow: hidden;
  height: 710px;
  position: relative;
`;

const StyledParagraph = styled(Paragraph)`
  width: 70%;
  text-align: center;
  font-size: 0.9rem;
`;

interface HyperlinkProps {
  $accentColor: string;
}

export const Hyperlink: React.FC<HyperlinkProps> = styled(motion.a)`
  color: ${({ $accentColor }) => `${$accentColor}`};
  font-size: 14px;
  font-weight: 400;
  border-bottom: 1px solid ${({ $accentColor }) => `${$accentColor}82`};
  display: flex;
  gap: 5px;
  align-items: center;
  margin-top: auto;
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

interface Props {
  asset: string;
  title: string;
  description: string;
  link: string;
  alt: string;
}

export default function ProjectCard({
  asset,
  title,
  description,
  link,
  alt,
}: Props) {
  const { scrollYProgress } = useScroll();
  const [startAndEndOfSticky, setStartAndEndOfSticky] = useState([0, 0]);
  const [isAboveThreshold, setIsAboveThreshold] = useState(false);
  const ref = useRef();
  const isProjectsInView = useInView(ref, { amount: 0.3 });
  const [hovered, setHovered] = useState(false);

  const scaleTransform = useTransform(
    scrollYProgress,
    [startAndEndOfSticky[0] + 0.1, startAndEndOfSticky[1]],
    [0.5, 0.9]
  );
  const rotateTransform = useTransform(
    scrollYProgress,
    [startAndEndOfSticky[0] + 0.1, startAndEndOfSticky[1]],
    [320, 360]
  );
  const opacityTransform = useTransform(
    scrollYProgress,
    [startAndEndOfSticky[0] + 0.1, startAndEndOfSticky[1]],
    [0, 1]
  );
  console.log(title, startAndEndOfSticky[0], startAndEndOfSticky[1]);

  const scale = useMotionTemplate`${scaleTransform}`;
  const rotateX = useMotionTemplate`${rotateTransform}deg`;

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
  }, []);

  return (
    <OutterContainer style={{ opacity: opacityTransform }}>
      <Column
        variants={container}
        animate={isProjectsInView ? "show" : "hidden"}
        initial="hidden"
      >
        <H2 variants={item}>{title}</H2>
        <StyledParagraph variants={item}>{description}</StyledParagraph>
        <Hyperlink
          target="_blank"
          href={link}
          $accentColor="#959595"
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          variants={item}
        >
          visit site
          <Arrow hovered={hovered} accentColor="#959595" />
        </Hyperlink>
      </Column>

      <Container style={{ scale, rotateX }} ref={ref}>
        <ImageContainer>
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

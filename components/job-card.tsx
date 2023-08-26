import styled from "styled-components";
import {
  motion,
  useTransform,
  useScroll,
  AnimatePresence,
  useMotionTemplate,
  useMotionValueEvent,
} from "framer-motion";
import { useRef } from "react";
import { Cursor } from "./framer-cursor";
import GitbookBranching from "./gitbook-branching";
import { colors, fontWeight, radius, shadows } from "../styles/theme";
import useViewport from "./hooks/useViewport";
import { H3, Label, Paragraph } from "./reusable/typography";
import { TicketswapTracing } from "./ticketswap-tracing";

// interface BorderWrapperProps {}

const BorderWrapper = styled(motion.li)`
  display: flex;
  padding: 0.35rem;
  align-items: center;
  justify-content: center;
  border-radius: ${radius["xl"]};
  height: 100%;
  z-index: ${({ id }) => id};
  background: ${colors.cardBorderBackground};
  /* background: ${({ cardIsFramerAndFinalTwo }) =>
    cardIsFramerAndFinalTwo ? colors.white : colors.cardBorderBackground}; */
`;

interface CardProps {
  $isMobile: boolean;
}

const Card = styled(motion.div)<CardProps>`
  display: flex;
  min-width: 100px;
  justify-content: flex-start;
  align-items: flex-start;
  border-radius: ${radius["lg"]};
  // Warning: if width gets changed, also do that for cardWidth in carousel.tsx
  width: ${({ $isMobile }) => ($isMobile ? "355px" : "420px")};
  height: ${({ $isMobile }) => ($isMobile ? "210px" : "230px")};
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  position: relative;
  background: ${colors.white};
  box-shadow: ${shadows.medium};
`;

const Description = styled(Paragraph)`
  font-weight: ${fontWeight["light"]};
  z-index: 2;
`;

const FlexRow = styled.span`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

const JobCardVariants = {
  default: {
    boxShadow:
      "0 0px 0px 0px #0000000a, 0 0px 0px 0px #00000008, 0 0px 0px 0px #00000003, 0 0px 0px #0000000d",
  },
  focused: {
    boxShadow:
      "0 0.6021873017743928px 3.010936508871964px -1.25px #0000000a, 0 2.288533303243457px 11.442666516217285px -2.5px #00000008, 0 10px 50px -3.75px #00000003, 0 20px 40px #0000000d",
  },
};

const variants = {
  hidden: {
    opacity: 0.2,
  },
  show: {
    opacity: 1,
  },
};

export default function JobCard({ roleEntry, activeCompany }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll();
  const { isMobile, isTablet, isLarge, isXLarge } = useViewport();

  const { role, company, companyDescription, description, dates, id } =
    roleEntry;
  const cardIsActive = activeCompany === company;

  // Create a configuration object for the different situations
  const config = {
    firstCard: {
      isMobile: { waypoints: [0.38, 0.6], position: [0, -380] },
      isTablet: { waypoints: [0.45, 0.55], position: [0, -380] },
      default: { waypoints: [0.5, 0.65], position: [0, -275] },
      isLarge: { waypoints: [0.5, 0.65], position: [0, -260] },
      isXLarge: { waypoints: [0.5, 0.65], position: [0, -175] },
    },
    secondCard: {
      isMobile: { waypoints: [0.53, 0.65], position: [0, -760] },
      isTablet: { waypoints: [0.475, 0.6], position: [0, -760] },
      default: { waypoints: [0.5, 0.65], position: [0, -550] },
      isLarge: { waypoints: [0.5, 0.65], position: [0, -520] },
      isXLarge: { waypoints: [0.5, 0.65], position: [0, -350] },
    },
  };

  // Function to get the correct config for a card
  const getCardConfig = (card, { isLarge, isXLarge, isMobile }) => {
    if (isXLarge) return config[card].isXLarge;
    if (isLarge) return config[card].isLarge;
    if (isTablet) return config[card].isTablet;
    if (isMobile) return config[card].isMobile;
    return config[card].default;
  };

  // Use the config to get the correct values for the first and second overlapping cards
  const firstCardConfig = getCardConfig("firstCard", {
    isLarge,
    isXLarge,
    isTablet,
    isMobile,
  });
  const firstOverlappingCard = useTransform(
    scrollYProgress,
    firstCardConfig.waypoints,
    firstCardConfig.position
  );

  const secondCardConfig = getCardConfig("secondCard", {
    isLarge,
    isXLarge,
    isTablet,
    isMobile,
  });
  const secondOverlappingCard = useTransform(
    scrollYProgress,
    secondCardConfig.waypoints,
    secondCardConfig.position
  );

  const overlappingCardsMap = {
    3: 0,
    4: firstOverlappingCard,
    5: secondOverlappingCard,
  };

  // Transforms for the Ticketswap line tracing and Framer cursors
  const yCursor1 = useTransform(scrollYProgress, [0.3, 0.6], [40, -80]);
  const xCursor1 = useTransform(scrollYProgress, [0.3, 0.6], [-20, 50]);
  const yCursor2 = useTransform(scrollYProgress, [0.5, 0.8], [-70, 15]);
  const xCursor2 = useTransform(scrollYProgress, [0.5, 0.8], [0, -70]);
  const alphaChannel = isMobile
    ? useTransform(scrollYProgress, [0.2, 0.3], [0, 100])
    : useTransform(scrollYProgress, [0.3, 0.45], [0, 100]);
  const pathLength = isMobile
    ? useTransform(scrollYProgress, [0.1, 0.2], [0, 1])
    : useTransform(scrollYProgress, [0.25, 0.4], [0, 1]);
  const fill = useMotionTemplate`rgb(237 248 255 / ${alphaChannel}%)`;
  const scale = useTransform(scrollYProgress, [0.25, 0.4], [1, 1.13]);

  const cardIsFramerAndFinalTwo = activeCompany === "framer" && id > 3;

  return (
    <BorderWrapper
      style={{ x: !cardIsFramerAndFinalTwo ? 0 : overlappingCardsMap[id] }}
      id={id}
      ref={ref}
      variants={JobCardVariants}
      animate={activeCompany === company ? "focused" : "default"}
      initial={activeCompany === company ? "focused" : "default"}
      transition={{ duration: 0.5 }}
    >
      <Card
        key={roleEntry.id}
        variants={variants}
        animate={activeCompany === company ? "show" : "hidden"}
        initial={activeCompany === company ? "show" : "hidden"}
        $isMobile={isMobile}
      >
        <FlexRow>
          <H3>{role}</H3>
          <Label>{dates}</Label>
        </FlexRow>
        <Description>{companyDescription}</Description>
        <Description>{description}</Description>

        {/* Company-specific interactive elements */}
        {/* Framer */}
        <AnimatePresence>
          {cardIsActive && company === "framer" && id === 3 && (
            <Cursor username="Sini" style={{ y: yCursor1, x: xCursor1 }} />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {cardIsActive && company === "framer" && id === 5 && (
            <Cursor
              username="Viktor"
              right
              style={{ y: yCursor2, x: xCursor2 }}
            />
          )}
        </AnimatePresence>

        {/* Ticketswap */}
        <AnimatePresence>
          {cardIsActive && company === "ticketswap" && (
            <TicketswapTracing
              pathLength={pathLength}
              fill={fill}
              scale={scale}
            />
          )}
        </AnimatePresence>

        {/* Gitbook */}
        {cardIsActive && company === "gitbook" && <GitbookBranching />}
      </Card>
    </BorderWrapper>
  );
}

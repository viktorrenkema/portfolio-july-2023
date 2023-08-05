import styled from "styled-components";
import {
  motion,
  useTransform,
  useScroll,
  AnimatePresence,
  useMotionTemplate,
} from "framer-motion";
import { AnchorHTMLAttributes, useRef } from "react";
import { Cursor } from "./framer-cursor";
import { TicketswapStamp } from "./ticketswap-stamp";
import GitbookBranching from "./gitbook-branching";
import { colors, device, radius, shadows } from "../styles/theme";
import useViewport from "./hooks/useViewport";

const BorderWrapper = styled(motion.li)`
  display: flex;
  padding: 0.35rem;
  align-items: center;
  justify-content: center;
  border-radius: ${radius["xl"]};
  height: 100%;
  z-index: ${({ id }) => id};
  background: ${colors.cardBorderBackground};
`;

interface CardProps {
  isMobile: boolean;
}

const Card = styled(motion.div)<CardProps>`
  display: flex;
  min-width: 100px;
  justify-content: flex-start;
  align-items: flex-start;
  border-radius: ${radius["lg"]};
  // Warning: if width gets changed, also do that for cardWidth in carousel.tsx
  width: ${({ $isMobile }) => ($isMobile ? "355px" : "420px")};
  height: ${({ $isMobile }) => ($isMobile ? "210px" : "255px")};
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  position: relative;
  backdrop-filter: blur(4px);
  background: ${colors.cardBackground};
  box-shadow: ${shadows.medium};
`;

interface CopyProps {
  children: React.ReactNode;
}

const Role: React.FC<CopyProps> = styled(motion.h1)<CopyProps>`
  font-size: 15px;

  @media ${device.mobileL} {
    font-size: 17px;
  }
`;

const Dates: React.FC<CopyProps> = styled(motion.h2)<CopyProps>`
  font-size: 10px;
  font-weight: 400;
  font-family: "Inter", sans-serif;
  text-align: center;
  border-radius: 8px;
  color: #707070;
  text-transform: uppercase;
  height: fit-content;
  padding: 3px 8px;
  white-space: nowrap;

  @media ${device.mobileL} {
    font-size: 12px;
  }
`;

const Description: React.FC<CopyProps> = styled(motion.span)<CopyProps>`
  font-size: 13px;
  font-weight: 300;

  @media ${device.mobileL} {
    font-size: 14px;
  }
`;

interface HyperlinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  $accentColor: string;
  children: any[];
}

const FlexRow = styled.span`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

export default function PreviousJobCard({ roleEntry, activeCompany }) {
  const { role, company, companyDescription, description, dates, id } =
    roleEntry;

  const ref = useRef(null);
  const { scrollYProgress } = useScroll();
  const { isMobile } = useViewport();

  const variants = {
    hidden: {
      opacity: 0.2,
    },
    show: {
      opacity: 1,
    },
  };

  const getOffsetLastFramerCards = () => {
    if (isMobile) {
      return id === 5 ? -520 : -420;
    }

    return id === 5 ? -620 : -310;
  };

  const overlappingCard = activeCompany === "framer" && (id === 4 || id === 5);
  const cardIsActive = activeCompany === company;

  // Transform of translateX for the final 2 Framer cards
  const x = useTransform(
    scrollYProgress,
    [0.55, 0.7],
    [0, getOffsetLastFramerCards()]
  );

  // Transform for the stamp on Ticketswap and cursors on Framer cards
  const yCursor1 = useTransform(scrollYProgress, [0.3, 0.6], [40, -80]);
  const xCursor1 = useTransform(scrollYProgress, [0.3, 0.6], [-20, 50]);
  const yCursor2 = useTransform(scrollYProgress, [0.5, 0.6], [30, -25]);
  const xCursor2 = useTransform(scrollYProgress, [0.5, 0.6], [0, 50]);
  const stampRotation = useTransform(scrollYProgress, [0, 0.6], [0, 360]);
  const rotate = useMotionTemplate`rotate(${stampRotation}deg)`;

  return (
    <BorderWrapper style={{ x: overlappingCard ? x : 0 }} id={id} ref={ref}>
      <Card
        key={roleEntry.id}
        variants={variants}
        animate={activeCompany === company ? "show" : "hidden"}
        initial={activeCompany === company ? "show" : "hidden"}
        $isMobile={isMobile}
      >
        <FlexRow>
          <Role>{role}</Role>
          <Dates>{dates}</Dates>
        </FlexRow>
        <Description>{companyDescription}</Description>
        <Description>{description}</Description>

        {/* Company-specific interactive elements */}

        {/* Framer */}
        <AnimatePresence>
          {cardIsActive && company === "framer" && id === 3 && (
            <Cursor username="Lynn" style={{ y: yCursor1, x: xCursor1 }} />
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
        {/* <AnimatePresence>
          {cardIsActive && company === "ticketswap" && (
            <TicketswapStamp rotate={rotate} />
          )}
        </AnimatePresence> */}

        {/* Gitbook */}
        {cardIsActive && company === "gitbook" && <GitbookBranching />}
      </Card>
    </BorderWrapper>
  );
}

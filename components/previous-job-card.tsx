import styled from "styled-components";
import {
  motion,
  useTransform,
  useScroll,
  AnimatePresence,
  useMotionTemplate,
} from "framer-motion";
import { AnchorHTMLAttributes, useEffect, useRef, useState } from "react";
import { Cursor } from "./framer-cursor";
import { TicketswapStamp } from "./ticketswap-stamp";
import GitbookBranching from "./gitbook-branching";

const BorderWrapper = styled(motion.li)`
  display: flex;
  padding: 0.2rem;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  height: 100%;
  z-index: ${({ id }) => id};
`;

const Card = styled(motion.div)`
  display: flex;
  min-width: 100px;
  justify-content: flex-start;
  align-items: flex-start;
  border-radius: 12px;
  width: 420px;
  height: 255px;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  position: relative;
  backdrop-filter: blur(4px);
  background: rgb(250 250 250 / 60%);
`;

interface CopyProps {
  children: React.ReactNode;
}

const Role: React.FC<CopyProps> = styled(motion.h1)<CopyProps>`
  font-size: 18px;
  color: "#000";
`;

const Dates: React.FC<CopyProps> = styled(motion.h2)<CopyProps>`
  font-size: 12px;
  font-weight: 400;
  font-family: "Inter", sans-serif;
  text-align: center;
  background: #f3f3f3;
  border-radius: 8px;
  border: 1px solid #ffffff3b;
  color: #707070;
  text-transform: uppercase;
  height: fit-content;
  padding: 3px 8px;
  white-space: nowrap;
`;

const Description: React.FC<CopyProps> = styled(motion.span)<CopyProps>`
  font-size: 14px;
  font-weight: 300;
  color: "#000";
`;

interface HyperlinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  $accentColor: string;
  children: any[];
}

const Hyperlink: React.FC<HyperlinkProps> = styled(motion.a)<HyperlinkProps>`
  font-size: 18px;
  color: #7d7d7d;
  font-size: 13px;
  font-weight: 400;
  border-bottom: 1px solid #d2d2d2;
  display: flex;
  gap: 5px;
  align-items: center;
  margin-top: auto;
`;

const Arrow = styled(motion.a)`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FlexRow = styled.span`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

export default function PreviousJobCard<Props>({
  roleEntry,
  activeCompany,
  setActiveCompany,
  isCarouselFullyInView,
}) {
  const { role, company, companyDescription, description, dates, id } =
    roleEntry;

  const elementRef = useRef(null);

  const variants = {
    hidden: {
      opacity: 0.2,
    },
    show: {
      opacity: 1,
    },
  };

  const offsetCard = id === 5 ? -620 : -310;
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0.55, 0.75], [0, offsetCard]);

  const yCursor1 = useTransform(scrollYProgress, [0.55, 0.75], [0, -40]);
  const yCursor2 = useTransform(scrollYProgress, [0.55, 0.75], [0, -25]);
  const xCursor1 = useTransform(scrollYProgress, [0.55, 0.75], [0, 20]);
  const xCursor2 = useTransform(scrollYProgress, [0.55, 0.75], [0, 50]);
  const stampRotation = useTransform(scrollYProgress, [0.2, 0.7], [0, 260]);

  const rotate = useMotionTemplate`rotate(${stampRotation}deg)`;

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const element = elementRef.current;
        const { left, right } = element.getBoundingClientRect();
        const windowWidth =
          window.innerWidth || document.documentElement.clientWidth;

        // Calculate the center of the viewport
        const viewportCenter = windowWidth / 2;

        // Check if the element has passed the center of the viewport on the x-axis
        if (left <= viewportCenter && right >= viewportCenter) {
          setActiveCompany(company);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const overlappingCard = activeCompany === "framer" && id !== 3;
  const cardIsActive = activeCompany === company;

  return (
    <BorderWrapper style={{ x: overlappingCard ? x : 0 }} id={id}>
      <Card
        key={roleEntry.id}
        variants={variants}
        animate={activeCompany === company ? "show" : "hidden"}
        initial={activeCompany === company ? "show" : "hidden"}
        ref={elementRef}
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
        <AnimatePresence>
          {cardIsActive && company === "ticketswap" && (
            <TicketswapStamp rotate={rotate} />
          )}
        </AnimatePresence>

        {/* Gitbook */}
        {isCarouselFullyInView && cardIsActive && company === "gitbook" && (
          <GitbookBranching />
        )}
      </Card>
    </BorderWrapper>
  );
}

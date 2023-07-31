import styled from "styled-components";
import { motion, useScroll, useTransform } from "framer-motion";
import { H1 } from "./typography/headings";
import { shadows } from "../styles/theme";

const OverlappingCard = styled(motion.div)`
  display: flex;
  flex-direction: column;
  padding: 2rem;
  width: 100%;
  align-items: center;
  border-radius: 12px;
  height: 1200px;
  background: white;
  margin-block-start: 2rem;
  box-shadow: ${shadows.large};
`;

const CompanyCard = styled(motion.div)`
  display: flex;
  width: 50%;
  align-items: center;
  border-radius: 24px;
`;

const Paragraph = styled(motion.p)`
  font-size: 1rem;
  margin-block-start: 0.5em;
`;

const variants = {
  initial: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function Companies() {
  const { scrollYProgress } = useScroll();

  const y = useTransform(scrollYProgress, [0, 1], [0, -400]);

  return (
    <OverlappingCard style={{ y }}>
      <CompanyCard>
        <Paragraph>Ticketswap</Paragraph>
      </CompanyCard>
      <CompanyCard></CompanyCard>
    </OverlappingCard>
  );
}

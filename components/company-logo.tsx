import styled from "styled-components";
import { motion } from "framer-motion";

const Container = styled(motion.div)`
  display: flex;
  align-items: center;
  border-radius: 50%;
  gap: 1rem;
`;

interface LogoBackgroundProps {
  tint: string;
}

const LogoBackground = styled(motion.div)<LogoBackgroundProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  border-radius: 50%;
  width: 250px;
  height: 90px;
  /* background: ${({ tint }) => `linear-gradient(
    135deg,
    ${tint}
  );`};
  border-radius: 12px; */
`;

const Span = styled.span`
  color: ${({ color }) => color};
`;

interface Props {
  logo: any;
  tint: string;
  border: string;
  color: string;
}

export default function CompanyLogo({
  logo,
  tint,
  animate,
  variants,
  initial,
}) {
  return (
    <Container variants={variants} animate={animate} initial={initial}>
      <LogoBackground tint={tint}>{logo}</LogoBackground>
    </Container>
  );
}

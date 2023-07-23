import styled from "styled-components";
import { motion } from "framer-motion";

export const ParagraphRole = styled(motion.p)`
  font-size: 0.75rem;
  margin-block-start: 0.5em;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.6px;
  color: #42517680;
`;

export const Paragraph = styled(motion.p)`
  font-size: 0.95rem;
  font-weight: 400;
  line-height: 1.4;
`;

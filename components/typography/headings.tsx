import styled from "styled-components";
import { motion } from "framer-motion";
import { device } from "../../styles/theme";

export const H1 = styled(motion.h1)`
  font-size: 1.5rem;
  font-weight: 500;
  text-align: center;
  width: 80%;

  @media ${device.mobile} {
    font-size: 1.25rem;
    width: 100%;
  }
`;

export const H2 = styled(motion.h2)`
  font-size: 1.5rem;
  font-weight: 500;
  text-align: center;
  width: 80%;

  @media ${device.mobile} {
    font-size: 1.35rem;
    width: 100%;
  }
`;

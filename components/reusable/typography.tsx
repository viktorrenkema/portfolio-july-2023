import styled from "styled-components";
import { motion } from "framer-motion";
import { colors, device, fontSize, fontWeight } from "../../styles/theme";

export const H1 = styled(motion.h1)`
  font-size: ${fontSize[32]};
  font-weight: ${fontWeight["medium"]};

  @media ${device.mobile} {
    font-size: ${fontSize[24]};
  }
`;

export const H2 = styled(motion.h2)`
  font-size: ${fontSize[24]};
  font-weight: ${fontWeight["medium"]};
  text-align: center;
  width: 80%;

  @media ${device.mobile} {
    font-size: ${fontSize[22]};
    width: 100%;
  }
`;

export const H3 = styled(motion.h2)`
  font-size: ${fontSize[14]};
  font-weight: ${fontWeight["medium"]};

  @media ${device.mobileL} {
    font-size: ${fontSize[18]};
  }
`;

export const Paragraph = styled(motion.p)`
  font-size: ${fontSize[14]};
  line-height: 1.4;
`;

export const Label = styled(motion.label)`
  font-size: ${fontSize[10]};
  color: ${colors.light};
  text-transform: uppercase;

  @media ${device.mobileL} {
    font-size: ${fontSize[12]};
  }
`;

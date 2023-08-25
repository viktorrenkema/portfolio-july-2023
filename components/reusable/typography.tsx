import styled from "styled-components";
import { motion } from "framer-motion";
import { colors, device, fontSize, fontWeight } from "../../styles/theme";

export const H1 = styled(motion.h1)`
  font-size: ${fontSize[48]};
  font-weight: ${fontWeight["bold"]};
  letter-spacing: 1.2px;
  font-family: "PPRadioGrotesk-Bold", sans-serif;

  @media ${device.mobile} {
    font-size: ${fontSize[36]};
  }
`;

export const H2 = styled(motion.h2)`
  font-size: ${fontSize[24]};
  font-weight: ${fontWeight["regular"]};
  text-align: center;
  font-family: "PPRadioGrotesk-Regular", sans-serif;
  letter-spacing: 1.25px;
  width: 80%;
  color: #444444;

  @media ${device.mobile} {
    font-size: ${fontSize[22]};
    width: 100%;
  }
`;

export const H3 = styled(motion.h3)`
  font-size: ${fontSize[16]};
  font-weight: ${fontWeight["medium"]};
  font-family: "PPRadioGrotesk-Regular", sans-serif;

  @media ${device.mobileL} {
    font-size: ${fontSize[20]};
  }
`;

export const Paragraph = styled(motion.p)`
  font-size: ${fontSize[13]};
  line-height: 1.4;
  color: ${colors.textLighter};

  @media ${device.mobileL} {
    font-size: ${fontSize[14]};
  }
`;

export const Label = styled(motion.label)`
  font-size: ${fontSize[10]};
  color: ${colors.light};
  text-transform: uppercase;

  @media ${device.mobileL} {
    font-size: ${fontSize[12]};
  }
`;

export const InlineHyperlink = styled(motion.a)`
  color: ${colors.blue};
  text-decoration: underline;
`;

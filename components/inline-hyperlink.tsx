import { motion } from "framer-motion";
import styled from "styled-components";
import { colors, fontSize } from "../styles/theme";
import React from "react";
import { Arrow } from "./reusable/icons";

export const Anchor = styled(motion.a)`
  display: inline-flex;
  align-items: center;
  gap: 0.05rem;
  font-size: 1rem;
  border-radius: 18px;
  font-weight: 500;
  padding-left: 2px;
  font-family: "PPRadioGrotesk-Regular", sans-serif;
  color: rgb(0, 153, 255, 1);
  line-height: 1.4;

  /* @media ${device.mobileL} {
    font-size: ${fontSize[20]};
  } */
`;

export const InlineHyperlink = ({ children, href }) => {
  const [hovered, setHovered] = React.useState(false);

  const color = [
    "rgb(0, 153, 255, 1)",
    "rgb(0, 153, 255, 0.5)",
    "rgb(0, 153, 255, 0.25)",
  ];

  const arrowVariants = {
    hover: {
      boxShadow: `${color[1]} 0px 0px 0px 3px, ${color[2]} 0px 0px 0px 5px`,
      transition: {
        duration: 0.2,
        ease: "easeIn",
      },
    },
    default: {
      boxShadow: `${color[1]} 0px 0px 0px 0px, ${color[2]} 0px 0px 0px 0px`,
    },
  };

  return (
    <Anchor
      href={href}
      onHoverStart={() => {
        setHovered(true);
      }}
      onHoverEnd={() => {
        setHovered(false);
      }}
      target="_blank"
      animate={hovered ? "hover" : "default"}
      variants={arrowVariants}
      initial="default"
    >
      {children}
      <Arrow color={color[0]} hovered={hovered} />
    </Anchor>
  );
};

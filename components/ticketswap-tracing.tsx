import styled from "styled-components";
import React from "react";
import { motion } from "framer-motion";

const Container = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: calc(50% - 60px);
  top: calc(50% - 44px);
  z-index: 0;
`;

const Icon = styled(motion.svg)`
  fill: rgba(0, 153, 255, 0);
  width: 119px;
  height: 80px;
`;

const Path = styled(motion.path)`
  stroke: #0099ff7d;
  stroke-width: 1.5;
`;

export const TicketswapTracing = ({ pathLength, fill, scale }) => {
  return (
    <Container style={{ scale }}>
      <Icon style={{ fill }}>
        <Path
          d="M 67.201 47.685 C 68.582 46.328 69.566 44.617 70.047 42.737 L 90.255 62.945 C 89.165 64.433 87.955 65.828 86.635 67.116 C 71.64 82.157 47.26 82.159 32.213 67.116 L 1.142 36.004 L 14.748 22.41 C 16.289 20.85 18.385 19.973 20.572 19.973 C 22.759 19.973 24.855 20.85 26.396 22.41 L 51.676 47.685 C 53.734 49.753 56.527 50.915 59.438 50.915 C 62.35 50.915 65.142 49.753 67.201 47.685 Z"
          style={{ pathLength }}
        ></Path>
        <Path
          d="M 66.059 27.712 C 67.44 26.355 68.424 24.644 68.905 22.764 L 89.113 42.972 C 88.023 44.46 86.812 45.855 85.493 47.142 C 70.498 62.184 46.118 62.186 31.071 47.142 L 0 16.03 L 13.606 2.436 C 15.146 0.877 17.243 0 19.43 0 C 21.617 0 23.713 0.877 25.254 2.436 L 50.533 27.712 C 52.592 29.78 55.385 30.942 58.296 30.942 C 61.208 30.942 64 29.78 66.059 27.712 Z"
          transform="translate(28 1) rotate(-180 44.556 29.212)"
          style={{ pathLength }}
        ></Path>
      </Icon>
    </Container>
  );
};

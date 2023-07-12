import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { styled } from "styled-components";

const Wrapper = styled(motion.div)`
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 4px;
  background: #f2f2f2;
  overflow: hidden;
  position: relative;
  align-content: center;
  flex-wrap: nowrap;
  gap: 16px;
  border-radius: 50%;
  margin-block-end: 1rem;
`;

const StyledImage = styled(Image)`
  border-radius: 50%;
`;

export const Avatar = ({ variants, animate, initial, transition }) => {
  return (
    <Wrapper
      variants={variants}
      animate={animate}
      initial={initial}
      transition={transition}
    >
      <StyledImage
        alt="A profile picture of me, Viktor."
        src="/images/me.jpeg"
        width="100"
        height="100"
      />
    </Wrapper>
  );
};

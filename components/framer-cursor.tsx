import styled from "styled-components";
import { motion } from "framer-motion";
import { colors, shadows, space } from "../styles/theme";
import useViewport from "./hooks/useViewport";

const Parallax = styled(motion.div)`
  position: absolute;
`;

const Outer = styled(motion.div)`
  position: absolute;
  z-index: 5;
`;

interface CursorBodyProps {
  right: boolean;
}

const cursorLeft = "#ffc341";
const cursorRight = "#ff6ef1";

const CursorBody = styled(motion.div)<CursorBodyProps>`
  position: absolute;
  background: ${({ right }) => (right ? cursorLeft : cursorRight)};
  color: ${colors.white};
  border-radius: 50px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  padding: ${space[8]} ${space[12]};
  box-shadow: ${shadows.small};
  left: ${({ right }) => (right ? "24px" : "-58px")};
  bottom: ${({ right }) => (right ? "-19px" : "-17px")};
`;

export const Cursor = ({ right = false, username, style }) => {
  const { isMobile } = useViewport();

  const getCursorStartingX = () => {
    if (isMobile) {
      return right ? 235 : 190;
    }
    return right ? 265 : 190;
  };

  const getCursorStartingY = () => {
    return right ? 40 : 152;
  };

  return (
    <Outer
      initial={{
        opacity: 0,
        x: getCursorStartingX() - 30,
        y: getCursorStartingY() - 40,
      }}
      animate={{
        opacity: 1,
        x: getCursorStartingX(),
        y: getCursorStartingY(),
        transition: {
          duration: 1.5,
        },
      }}
      exit={{
        opacity: 0,
        x: getCursorStartingX() - 10,
        y: getCursorStartingY() - 10,
        transition: {
          duration: 0.5,
        },
      }}
      drag
      dragConstraints={{ left: 300, right: 300, top: 300, bottom: 300 }}
    >
      {/* Parallax container */}
      <Parallax style={style}>
        <CursorArrow right={right} />
        <CursorBody right={right}>{username}</CursorBody>
      </Parallax>
    </Outer>
  );
};

const CursorArrow = ({ right }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      style={{ transform: right ? "rotate(265deg)" : "rotate(4deg)" }}
    >
      <g transform="translate(4 0) rotate(90 11 15)">
        <path d="M 0 0 L 22 0 L 22 30 L 0 30 Z" fill="transparent"></path>
        <g transform="translate(2.326 7.761)">
          <path
            d="M 1.34 0.048 C 0.546 -0.198 -0.2 0.542 0.048 1.329 L 5.183 17.625 C 5.291 17.967 5.571 18.228 5.921 18.313 C 6.272 18.399 6.642 18.296 6.897 18.043 L 18.194 6.84 C 18.449 6.587 18.552 6.22 18.466 5.872 C 18.38 5.525 18.117 5.247 17.772 5.141 Z"
            fill="rgb(0,0,0)"
          ></path>
        </g>
        <path
          d="M 3.666 7.81 C 2.872 7.563 2.126 8.303 2.375 9.091 L 7.51 25.387 C 7.617 25.728 7.897 25.989 8.247 26.075 C 8.598 26.16 8.968 26.058 9.223 25.805 L 20.52 14.601 C 20.775 14.348 20.878 13.981 20.792 13.634 C 20.706 13.286 20.443 13.009 20.098 12.902 Z"
          fill={right ? cursorLeft : cursorRight}
        ></path>
      </g>
    </svg>
  );
};

import styled from "styled-components";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";

const BalloonContainer = styled(motion.div)`
  display: flex;
  background: #44cffd;
  padding: 4px;
  border-radius: 50%;
`;

const Balloon = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  height: 100px;
  width: 100px;
  background: #00b6f0;
  /* border: 4px solid #44cffd; */
  margin-block-start: 2rem;
`;

export default function BalloonTicketswap() {
  const { scrollYProgress } = useScroll();

  const width = useTransform(scrollYProgress, [0.2, 0.5], [60, 100]);
  const transform = useMotionTemplate`${width}vh`;

  const y = useTransform(scrollYProgress, [0, 1], [0, -400]);

  return (
    <BalloonContainer>
      <Balloon
      // style={{ width: transform, height: transform }}
      >
        <TicketswapLogo />
      </Balloon>
    </BalloonContainer>
  );
}

function TicketswapLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="78" height="52">
      <path
        d="M 44.069 31.254 C 44.991 30.348 45.647 29.206 45.968 27.952 L 59.449 41.438 C 58.722 42.431 57.914 43.362 57.034 44.221 C 47.031 54.259 30.766 54.261 20.728 44.221 L 0 23.458 L 9.077 14.386 C 10.105 13.346 11.503 12.761 12.962 12.761 C 14.421 12.761 15.819 13.346 16.847 14.386 L 33.712 31.254 C 35.085 32.634 36.948 33.409 38.891 33.409 C 40.833 33.409 42.696 32.634 44.069 31.254 Z M 57.034 7.887 L 77.778 28.651 L 68.709 37.751 C 66.554 39.895 63.083 39.895 60.928 37.751 L 44.069 20.859 C 41.2 18.007 36.581 18.007 33.712 20.859 C 32.802 21.772 32.147 22.909 31.812 24.156 L 18.334 10.67 C 19.068 9.689 19.868 8.759 20.728 7.887 C 30.766 -2.145 47.031 -2.145 57.034 7.887 Z"
        fill="rgb(255,255,255)"
      ></path>
    </svg>
  );
}

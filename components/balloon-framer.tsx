import styled from "styled-components";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";

const BalloonContainer = styled(motion.div)`
  display: flex;
  height: 1000px;
`;

const Balloon = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  height: 100px;
  width: 100px;
  background: #000;
  border: 4px solid #2e2e2e;
  margin-block-start: 2rem;
`;

export default function BalloonFramer() {
  const { scrollYProgress } = useScroll();

  const width = useTransform(scrollYProgress, [0.2, 0.5], [60, 100]);
  const transform = useMotionTemplate`${width}vh`;

  const y = useTransform(scrollYProgress, [0, 1], [0, -400]);

  return (
    <BalloonContainer>
      <Balloon
      // style={{ width: transform, height: transform }}
      >
        <FramerLogo />
      </Balloon>
    </BalloonContainer>
  );
}

export function FramerLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="59">
      <path
        d="M 38.293 37.655 C 38.579 37.933 38.665 38.359 38.509 38.726 C 38.351 39.096 37.988 39.335 37.587 39.333 L 21 39.333 C 20.737 39.33 20.484 39.433 20.297 39.617 C 20.109 39.802 20.002 40.054 20 40.317 L 20 56.627 C 20 57.025 19.756 57.382 19.382 57.534 C 19.009 57.687 18.582 57.603 18.293 57.322 L 0.389 39.716 C 0.141 39.472 0 39.138 0 38.789 L 0 20.65 C 0 20.107 0.448 19.667 1 19.667 L 20 19.667 Z M 20 19.667 L 1.707 1.678 C 1.422 1.4 1.336 0.975 1.491 0.608 C 1.648 0.237 2.012 -0.002 2.413 0 L 39 0 C 39.552 0 40 0.44 40 0.983 L 40 18.683 C 39.998 18.946 39.891 19.198 39.703 19.383 C 39.516 19.567 39.263 19.67 39 19.667 Z"
        fill="rgb(255,255,255)"
      ></path>
    </svg>
  );
}

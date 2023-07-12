import styled from "styled-components";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useState } from "react";
import { H1 } from "./typography/headings";
import { ParagraphRole } from "./typography/paragraphs";

const BalloonContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding-bottom: 4px;
  background: #dfe8ff;
  /* position: absolute; */
`;

const Balloon = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  height: 100px;
  width: 100px;
  background: #90b0ff;
  /* border: 4px solid #dfe8ff; */
`;

const Description = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-block-start: 1rem;
`;

const scrollInputRange = [0.2, 0.3, 0.4, 0.5];
const borderRadiusRange = [50, 0, 0, 50];
const paddingRange = [4, 20, 20, 4];

const scrollLowerTrigger = 0.24;
const scrollUpperTrigger = 0.44;

export default function BalloonGitbook() {
  // const { scrollYProgress } = useScroll();
  // const [innerWidth, setInnerWidth] = useState(0);
  // const [isAboveThreshold, setIsAboveThreshold] = useState(false);

  // const vwBasedOnInnerWidth = (108 / innerWidth) * 100;

  // const percentage = useTransform(scrollYProgress, scrollInputRange, [
  //   vwBasedOnInnerWidth,
  //   80,
  //   80,
  //   vwBasedOnInnerWidth,
  // ]);

  // const width = useMotionTemplate`${percentage}vw`;
  // const height = useMotionTemplate`${percentage}vh`;

  // const borderRadius = useTransform(
  //   scrollYProgress,
  //   scrollInputRange,
  //   borderRadiusRange
  // );
  // const paddingTop = useTransform(
  //   scrollYProgress,
  //   scrollInputRange,
  //   paddingRange
  // );

  // useEffect(() => {
  //   // Store the inner width of viewing browser
  //   setInnerWidth(window.innerWidth);

  //   // Add listener to the scrollYProgress to check if the trigger is passed to display the details
  //   const updateThreshold = () => {
  //     setIsAboveThreshold(
  //       scrollYProgress.get() > scrollLowerTrigger &&
  //         scrollYProgress.get() < scrollUpperTrigger
  //     );
  //   };

  //   scrollYProgress.on("change", updateThreshold);

  //   // Cleanup the event listener when the component unmounts
  //   return () => {
  //     scrollYProgress.on("change", updateThreshold);
  //   };
  // }, [scrollYProgress]);

  return (
    <BalloonContainer
    // style={{ width, height, borderRadius, paddingTop }}
    >
      <Balloon>
        <GitbookLogo flip={false} />
      </Balloon>
      {/* {isAboveThreshold && (
        <Description>
          <H1 style={{ color: "#425176" }}>Gitbook</H1>
          <ParagraphRole>Product Engineer</ParagraphRole>
        </Description>
      )} */}
    </BalloonContainer>
  );
}

export function GitbookLogo({ flip }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="78" height="55">
      <path
        d="M 43.889 1.186 L 69.233 13.81 C 70.404 14.393 70.422 16.051 69.264 16.66 L 36.348 33.966 C 34.513 34.931 32.323 34.955 30.467 34.031 L 9.801 23.737 C 7.283 22.729 4.468 24.569 4.468 27.341 C 4.468 29.57 5.732 31.607 7.733 32.604 L 28.453 42.924 C 29.717 41.642 31.479 40.846 33.426 40.846 C 35.318 40.846 37.034 41.597 38.29 42.816 L 64.098 29.247 C 64.026 28.844 63.99 28.435 63.99 28.025 C 63.99 24.19 67.111 21.081 70.961 21.081 C 74.811 21.081 77.932 24.19 77.932 28.025 C 77.932 31.86 74.811 34.969 70.961 34.969 C 69.079 34.969 67.37 34.226 66.116 33.018 L 40.294 46.594 C 40.362 46.983 40.397 47.382 40.397 47.79 C 40.397 51.625 37.276 54.735 33.426 54.735 C 29.576 54.735 26.455 51.625 26.455 47.79 C 26.455 47.435 26.482 47.087 26.534 46.746 L 5.514 36.277 C 2.244 34.648 0.178 31.318 0.178 27.676 L 0.178 25.648 C 0.178 22.874 1.719 20.328 4.182 19.034 L 38.008 1.25 C 39.843 0.285 42.033 0.261 43.889 1.186 Z M 33.426 50.461 C 34.907 50.461 36.107 49.265 36.107 47.79 C 36.107 46.315 34.907 45.119 33.426 45.119 C 31.946 45.119 30.745 46.315 30.745 47.79 C 30.745 49.265 31.946 50.461 33.426 50.461 Z"
        fill="rgb(255,255,255)"
      ></path>
      <path
        d="M 73.642 28.025 C 73.642 29.5 72.442 30.696 70.961 30.696 C 69.48 30.696 68.28 29.5 68.28 28.025 C 68.28 26.55 69.48 25.354 70.961 25.354 C 72.442 25.354 73.642 26.55 73.642 28.025 Z"
        fill="#90b0ff"
      ></path>
    </svg>
  );
}

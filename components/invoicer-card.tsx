import styled from "styled-components";
import {
  motion,
  useMotionTemplate,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { H1 } from "./typography/headings";
import { Paragraph } from "./typography/paragraphs";
import Image from "next/image";

const Container = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background: #f7f7f7;
  height: auto;
  box-shadow: rgba(0, 0, 0, 0.07) 2.2px 2.2px 16.9px,
    rgba(0, 0, 0, 0.067) 5.1px 5.1px 44.4px, rgba(0, 0, 0, 0.07) 10px 10px 136px;
  padding: 2rem;
  //
  display: flex;
  flex: none;
  flex-direction: row;
  flex-wrap: nowrap;
  gap: 20px;
  /* height: 828px; */
  justify-content: center;
  width: 100vw;
  max-width: 1440px;
  overflow: visible;
  padding: 4px;
  position: relative;
  user-select: none;
  z-index: 3;
  border-radius: 14px;
`;

const CardContents = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-block-start: 4rem;
  gap: 2rem;
  padding: 0rem 2rem;
`;

const ParagraphContainer = styled(motion.div)`
  margin-top: 1em;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0rem 4rem;
`;

const StyledImage = styled(Image)`
  object-fit: cover;
  object-position: left 0%;
`;

export const ImageContainer = styled(motion.div)`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  backdrop-filter: blur(2px);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgb(227 227 227);
  height: 622px;
  position: relative;
`;

const variants = {
  hide: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: 1 },
};

export default function InvoicerCard() {
  const { scrollYProgress } = useScroll();
  const [startAndEndOfSticky, setStartAndEndOfSticky] = useState([0, 0]);
  const [isAboveThreshold, setIsAboveThreshold] = useState(false);
  const ref = useRef();

  const scaleTransform = useTransform(
    scrollYProgress,
    [startAndEndOfSticky[0], startAndEndOfSticky[1]],
    [0.6, 1]
  );
  const rotateTransform = useTransform(
    scrollYProgress,
    [startAndEndOfSticky[0], startAndEndOfSticky[1]],
    [320, 360]
  );

  const scale = useMotionTemplate`${scaleTransform}`;
  const rotateX = useMotionTemplate`${rotateTransform}deg`;

  useEffect(() => {
    const refElement = ref.current;
    const { top, height } = refElement.getBoundingClientRect();

    const documentHeight =
      document.documentElement.scrollHeight || document.body.scrollHeight;

    const refPercentageStart = top / (documentHeight - height) - 0.3;
    const refPercentageEnd = (top + height) / documentHeight;

    setStartAndEndOfSticky([refPercentageStart, refPercentageEnd]);

    // Add listener to the scrollYProgress to check if the trigger is passed to display the details
    const checkForThreshold = () => {
      if (scaleTransform.get() > 95) {
        setIsAboveThreshold(true);
      }
      if (scaleTransform.get() < 95) {
        setIsAboveThreshold(false);
      }
    };

    scrollYProgress.on("change", checkForThreshold);

    // Cleanup the event listener when the component unmounts
    return () => {
      scrollYProgress.on("change", checkForThreshold);
    };
  }, []);

  return (
    <Container style={{ scale, rotateX }} ref={ref}>
      <ImageContainer>
        <StyledImage
          alt="A screenshot of an invoice maker app"
          src="/images/projects/invoicer-full.png"
          layout="fill"
        />
      </ImageContainer>
      {/* <CardContents
        variants={variants}
        animate={isAboveThreshold ? "show" : "hide"}
        initial="hide"
      >
        <H1>Invoicer.studio</H1>
        <ImageContainer>
          <StyledImage
            alt="A screenshot of an invoice maker app"
            src="/images/projects/invoicer.png"
            layout="fill"
          />
        </ImageContainer>
        <ParagraphContainer>
          <Paragraph>
            In the first quarter of 2023, I set out to build a product with the
            aim of giving at least a single person some kind of value. Invoicer
            is a tool that allows you to create invoices and send them to your
            clients.
          </Paragraph>
          <Paragraph>
            It is fully client-side with zero back-end, and leverages browser
            functionality to print invoices as PDF. A big part of the time spent
            on Invoicer was on researching the best ways to use web technology
            to generate the DOM to PDF.
          </Paragraph>
          <Paragraph>
            I learned a lot about this, and ended up deciding it was most
            logical to rely on the browser's built-in print functionality.
          </Paragraph>
        </ParagraphContainer>
      </CardContents> */}
    </Container>
  );
}

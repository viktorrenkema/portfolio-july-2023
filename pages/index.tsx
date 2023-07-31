import styled from "styled-components";
import Meta from "../components/meta";
import { motion, useInView } from "framer-motion";
import { H1 } from "../components/typography/headings";
import { useEffect, useRef, useState } from "react";
import { Carousel } from "../components/carousel";
import ProjectCard from "../components/project-card";
import { Paragraph } from "../components/typography/paragraphs";
import SocialButton from "../components/social-button";
import { device } from "../styles/theme";
import useViewport from "../components/hooks/useViewport";

const Main = styled(motion.main)`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const StickyRolesContainer = styled(motion.div)`
  min-height: ${({ $stickyMinHeight }) => `${$stickyMinHeight}px`};
  width: 100%;
  overflow: clip;
  overflow-y: visible; // remove this if this leads to scroll animation issues, it only impacts the framer cursor
`;

const CompaniesContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  position: -webkit-sticky; /* Safari */
  position: sticky;
  gap: 3rem;
  top: 20%;
  // Warning: changes in padding can impact the caroussel calculations
  padding: 0 10%;

  @media ${device.tablet} {
    padding: 0 20%;
    gap: 4rem;
  }
`;

export const GradientOrange = styled(motion.div)`
  background: url("/images/gradients/yellow-orange-red.png") no-repeat center
    center;
  width: 100vw;
  height: 100vh;
  background-size: contain;
  position: absolute;
  z-index: -1;
  /* transform: scale(2); */
  opacity: 0.5;
`;

export const GradientBlue = styled(motion.div)`
  background: url("/images/gradients/green-blue.png") no-repeat center center;
  width: 100vw;
  height: 100vh;
  background-size: contain;
  position: absolute;
  z-index: -1;
  bottom: 0;
  transform: scale(2);
  opacity: 0.5;
`;

const CompaniesHeadings = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 0.5rem;
`;

const ProjectsContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5rem;
  margin-top: 8rem;
  perspective: 1200px;
`;

const FlexRow = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

export const appearVariants = {
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeIn",
      delay: 0.5,
    },
  },
  hide: {
    opacity: 0,
    y: 10,
  },
};

const container = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.25,
      duration: 0.4,
      ease: "easeIn",
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Home() {
  const ref = useRef(null);
  const { viewportWidth } = useViewport();
  const isCarouselInView = useInView(ref, { amount: 0.1 });
  const isCarouselFullyInView = useInView(ref, { amount: 0.45 });

  const [stickyMinHeight, setStickyMinHeight] = useState(1000);
  const [stickyCarouselEndPosition, setStickyCarouselEndPosition] = useState(0);

  useEffect(() => {
    const element = ref.current;
    const { width } = element.getBoundingClientRect();

    setStickyMinHeight(Math.floor(width * 2));
  }, []);

  useEffect(() => {
    const documentHeight =
      document.documentElement.scrollHeight || document.body.scrollHeight;

    const endOfStickyInPercentage = stickyMinHeight / documentHeight;

    setStickyCarouselEndPosition(endOfStickyInPercentage);
  }, [stickyMinHeight]);

  const paddingLeft = viewportWidth > 425 ? "0 20%" : "0 10%";

  return (
    <div>
      <Meta />
      <Main>
        <StickyRolesContainer $stickyMinHeight={stickyMinHeight}>
          <CompaniesContainer $paddingLeft={paddingLeft}>
            <CompaniesHeadings
              variants={container}
              animate={isCarouselInView ? "show" : "hidden"}
              initial="hidden"
            >
              <H1 variants={item}>Viktor Renkema</H1>
              <Paragraph variants={item}>
                I'm a software engineer, and got to be part of some pretty
                amazing teams.
              </Paragraph>
              <FlexRow variants={container}>
                <SocialButton
                  text="twitter"
                  url="https://www.twitter.com/vrenkema"
                  variants={item}
                />
                <SocialButton
                  text="linkedin"
                  url="https://www.linkedin.com/in/viktor-renkema-7b3505133/"
                  variants={item}
                />
                <SocialButton
                  text="github"
                  url="https://github.com/viktorrenkema"
                  variants={item}
                />
                <SocialButton
                  text="email"
                  url="mailto:vrenkema@gmail.com"
                  variants={item}
                />
              </FlexRow>
            </CompaniesHeadings>

            <Carousel
              ref={ref}
              animate={"show"}
              variants={appearVariants}
              initial="hide"
              isCarouselFullyInView={isCarouselFullyInView}
              stickyCarouselEndPosition={stickyCarouselEndPosition}
              stickyMinHeight={stickyMinHeight}
              paddingLeft={paddingLeft}
            />
            <GradientOrange />
          </CompaniesContainer>
        </StickyRolesContainer>
        <ProjectsContainer>
          <ProjectCard
            title="Invoicer.studio"
            firstDescription="I built Invoicer in Q1 2023 with the aim of building a full product
          that will at least get a single (symbolic) Euro in revenue."
            link="https://invoicer.studio"
            asset="/images/projects/invoicer.png"
            alt="A screenshot of invoicer.studio, my invoice generator project"
            linkText="Visit invoicer.studio"
          />
        </ProjectsContainer>
        <ProjectsContainer>
          <ProjectCard
            title="Workout tracker"
            firstDescription="As a frequent gym visitor, I wanted to track my workouts. Building my own PWA allowed me to build exactly the features I want myself."
            link="https://esteem-app.vercel.app"
            asset="/images/projects/workout-tracker.png"
            alt="A screenshot of the workout app"
            linkText="Visit the app (made for mobile)"
          />
        </ProjectsContainer>
        <ProjectsContainer>
          <ProjectCard
            title="Trust factors on Ticketswap"
            firstDescription="At Ticketswap, we were working to shorten the buy-flow, possibly eliminating a page that displayed trust factors. For a hackathon day, I explored with displaying these sooner in the flow in a fun and interactive way."
            secondDescription="The project was well-received and approved for production, but I didn't get to finish it before I left."
            link="https://www.ticketswap.com"
            asset="/images/projects/ticketswap.gif"
            alt="An animated image of a popover displaying trust factors on hover"
            linkText="Visit ticketswap.com"
          />
        </ProjectsContainer>
        {/* <GradientBlue /> */}
      </Main>
    </div>
  );
}

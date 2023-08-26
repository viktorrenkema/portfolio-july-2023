import styled from "styled-components";
import Meta from "../components/meta";
import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Carousel } from "../components/carousel";
import ProjectCard from "../components/project-card";
import SocialButton from "../components/social-button";
import { device } from "../styles/theme";
import useViewport from "../components/hooks/useViewport";
import { H1, Paragraph } from "../components/reusable/typography";
import { AboutMe } from "../components/about-me";
import Footer from "../components/footer";

const Main = styled(motion.main)`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

interface StickyRolesContainer {
  $stickyMinHeight: number;
}

const StickyRolesContainer = styled(motion.div)<StickyRolesContainer>`
  min-height: ${({ $stickyMinHeight }) => `${$stickyMinHeight}px`};
  width: 100%;
  overflow: clip;
  overflow-y: visible; // remove this if this leads to scroll animation issues, it only impacts the framer cursor
`;

interface CompaniesContainerProps {
  $paddingLeft: string;
}

const CompaniesContainer = styled(motion.div)<CompaniesContainerProps>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  position: -webkit-sticky; /* Safari */
  position: sticky;
  gap: 3rem;

  // On mobile devices, the 'top' is set to fixed px as a fix for iOS bottom address bar hiding on scroll. Relative values of top: 20% causes jittering since the bottom address bar is causing the vh to increase,which affects percentual values.
  top: 145px;

  // Warning: changes in padding can impact the caroussel calculations
  padding: 0 10%;

  @media ${device.tablet} {
    padding: 0 20%;
    gap: 4rem;
    top: 20%;
  }
`;

const GradientOrange = styled(motion.div)`
  background: url("/images/gradients/yellow-orange-red.png") no-repeat center
    center;
  width: 350vw;
  height: 333vh;
  background-size: contain;
  position: absolute;
  z-index: -1;
  opacity: 1;
  left: -300px;
  opacity: 0.75;
  pointer-events: none;

  @media ${device.tablet} {
    left: 0px;
    width: 200vw;
    height: 200vh;
  }
`;

const GradientPurple = styled(motion.div)`
  background: url("/images/gradients/purple-cyan.png") no-repeat center center;
  width: 360vw;
  height: 500vh;
  background-size: contain;
  position: absolute;
  z-index: -1;
  top: -800px;
  left: -300px;
  opacity: 0.75;
  pointer-events: none;

  @media ${device.tablet} {
    top: 610px;
    left: -824px;
    width: 200vw;
    height: 200vh;
  }
`;

const GradientBlue = styled(motion.div)`
  background: url("/images/gradients/green-blue.png") no-repeat center center;
  width: 300vw;
  height: 300vh;
  background-size: contain;
  position: absolute;
  z-index: -1;
  opacity: 0.75;
  pointer-events: none;
  bottom: -2750px;
  left: -230px;

  @media ${device.tablet} {
    bottom: -3660px;
    left: -1300px;
  }

  @media ${device.desktop} {
    bottom: -5365px;
    left: -1300px;
  }
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

  const [stickyMinHeight, setStickyMinHeight] = useState(1000);

  useEffect(() => {
    const element = ref.current;
    const { width } = element.getBoundingClientRect();

    setStickyMinHeight(Math.floor(width * 2.5));
  }, []);

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
                I'm a software engineer that got to be part of some pretty
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
            />
            <GradientOrange />
            <GradientPurple />
            <GradientBlue />
          </CompaniesContainer>
        </StickyRolesContainer>
        <AboutMe item={item} />
        <ProjectsContainer>
          <ProjectCard
            title="Invoicer.studio"
            firstDescription="At the start of 2023 I set out to build a complete app from scratch to learn a new topic in web dev. This became an app to generate invoices, to learn more about pdf's and creating a live UI editor in the web."
            link="https://invoicer.studio"
            asset="/images/projects/invoicer.png"
            alt="A screenshot of invoicer.studio, my invoice generator project"
            linkText="Visit invoicer.studio"
            id="invoicer"
          />
        </ProjectsContainer>
        <ProjectsContainer>
          <ProjectCard
            title="Workout tracker"
            firstDescription="As a frequent gym visitor, I wanted to track my workouts and get certain functionality like easily checking my previous stats. I decided to build a PWA with my own tiny back-end, as I didn't have much experience yet with things like PWA's, node, and Firebase back then."
            secondDescription="Aside from learning new tech, my other motivation was that I now had full control over which features I could create for my workouts."
            link="https://esteem-app.vercel.app"
            asset="/images/projects/workout-tracker.png"
            alt="A screenshot of the workout app"
            linkText="Visit the app (made for mobile)"
            id="workout"
          />
        </ProjectsContainer>
        <ProjectsContainer>
          <ProjectCard
            title="Trust factors on Ticketswap"
            firstDescription="At Ticketswap, we were aiming to shorten the buy-flow. This meant we'd possibly eliminate a page that displayed important trust factors. For a hackathon day, I explored how we could retain these by displaying them sooner in the flow in a fun and interactive way."
            secondDescription="The project was very well-received and approved to go from a hackathon project to a production feature."
            link="https://www.ticketswap.com"
            asset="/images/projects/ticketswap.gif"
            alt="An animated image of a popover displaying trust factors on hover"
            linkText="Visit ticketswap.com"
            id="ticketswap"
          />
        </ProjectsContainer>
        <Footer />
      </Main>
    </div>
  );
}

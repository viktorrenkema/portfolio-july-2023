import styled from "styled-components";
import Headline, { Gradient } from "../components/headline";
import Meta from "../components/meta";
import { motion, useInView } from "framer-motion";
import { H1 } from "../components/typography/headings";
import { useRef } from "react";
import { Carousel } from "../components/carousel";
import ProjectCard from "../components/project-card";

const Main = styled(motion.main)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StickyRolesContainer = styled(motion.div)`
  min-height: 450vh;
  width: 100%;
  overflow: clip;
  overflow-y: visible; // remove this if this leads to scroll animation issues, it only impacts the framer cursor
`;

const CompaniesContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  position: sticky;
  top: 30%;
`;

const CompaniesHeadings = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
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

export const appearVariants = {
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeIn",
    },
  },
  hide: {
    opacity: 0,
    y: 10,
  },
};

export default function Home() {
  const refTeams = useRef(null);
  const isTeamsInView = useInView(refTeams, { amount: 1 });

  const ref = useRef(null);
  const isCarouselInView = useInView(ref, { amount: 0.1 });
  const isCarouselFullyInView = useInView(ref, { amount: 0.45 });

  return (
    <div>
      <Meta />
      <Main>
        <Headline />

        <StickyRolesContainer>
          <CompaniesContainer>
            <CompaniesHeadings>
              <H1
                ref={refTeams}
                animate={isTeamsInView ? "show" : "hide"}
                initial="hide"
                variants={appearVariants}
              >
                I've been part of some pretty amazing teams.
              </H1>
            </CompaniesHeadings>

            <Carousel
              ref={ref}
              animate={isCarouselInView ? "show" : "hide"}
              variants={appearVariants}
              initial="hide"
              isCarouselFullyInView={isCarouselFullyInView}
            />
            <Gradient />
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
      </Main>
    </div>
  );
}

import styled from "styled-components";
import Headline from "../components/headline";
import Meta from "../components/meta";
import { motion, useInView } from "framer-motion";
import { H1, H2 } from "../components/typography/headings";
import { useRef } from "react";
import InvoicerCard from "../components/project-card";
import { Carousel } from "../components/carousel";
import { Paragraph } from "../components/typography/paragraphs";
import ProjectCard from "../components/project-card";

const Main = styled(motion.main)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StickyRolesContainer = styled(motion.div)`
  min-height: 350vh;
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
                I worked with some pretty amazing teams.
              </H1>
            </CompaniesHeadings>

            <Carousel
              ref={ref}
              animate={isCarouselInView ? "show" : "hide"}
              variants={appearVariants}
              initial="hide"
              isCarouselFullyInView={isCarouselFullyInView}
            />
          </CompaniesContainer>
        </StickyRolesContainer>
        <ProjectsContainer>
          <ProjectCard
            title="Invoicer.studio"
            description="I built Invoicer in Q1 2023 with the aim of building a full product
          that will at least get a single (symbolic) Euro in revenue."
            link="https://invoicer.studio"
            asset="/images/projects/invoicer-full.png"
            alt="A screenshot of invoicer.studio, my invoice generator project"
          />
        </ProjectsContainer>
        <ProjectsContainer>
          <ProjectCard
            title="Workout tracker"
            description="As a frequent gym visitor, I wanted to track my workouts. Building my own PWA allowed me to build exactly the features I want myself."
            link="https://invoicer.studio"
            asset="/images/projects/workout-tracker.png"
            alt="A screenshot of the workout app"
          />
        </ProjectsContainer>
        {/* <div style={{ height: "100vh" }}></div> */}
      </Main>
    </div>
  );
}

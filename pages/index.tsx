import styled from "styled-components";
import Headline from "../components/headline";
import Meta from "../components/meta";
import { motion, useInView } from "framer-motion";
import { H1, H2 } from "../components/typography/headings";
import { useRef } from "react";
import InvoicerCard from "../components/invoicer-card";
import { Carousel } from "../components/carousel";

const Main = styled(motion.main)`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StickyRolesContainer = styled(motion.div)`
  min-height: 350vh;
  width: 100%;
  overflow: clip;
`;

const CompaniesContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5rem;
  position: sticky;
  top: 10%;
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

const variants = {
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
  const refProjects = useRef(null);
  const isTeamsInView = useInView(refTeams, { amount: 1 });
  const isProjectsInView = useInView(refProjects, { amount: 1 });

  const ref = useRef(null);
  const isCarouselInView = useInView(ref, { amount: 0.1 });

  return (
    <div>
      <Meta />
      <Main>
        <Headline />

        <StickyRolesContainer>
          <CompaniesContainer>
            <H2
              ref={refTeams}
              animate={isTeamsInView ? "show" : "hide"}
              initial="hide"
              variants={variants}
            >
              I worked on some pretty amazing teams.
            </H2>
            <Carousel
              ref={ref}
              animate={isCarouselInView ? "show" : "hide"}
              variants={variants}
              initial="hide"
            />
          </CompaniesContainer>
        </StickyRolesContainer>
        <ProjectsContainer>
          <H2
            ref={refProjects}
            animate={isProjectsInView ? "show" : "hide"}
            initial="hide"
            variants={variants}
          >
            Here's some of my recent projects.
          </H2>
          <InvoicerCard />
        </ProjectsContainer>
        {/* <div style={{ height: "100vh" }}></div> */}
      </Main>
    </div>
  );
}

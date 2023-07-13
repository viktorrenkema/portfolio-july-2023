import styled from "styled-components";
import { motion, useTransform, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const BorderWrapper = styled(motion.li)`
  display: flex;
  padding: 0.1rem;
  background: #ebebeb;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  height: 100%;
`;

const Card = styled(motion.div)`
  display: flex;
  min-width: 100px;
  justify-content: flex-start;
  align-items: flex-start;
  border-radius: 12px;
  width: 420px;
  height: 200px;
  /* width: 375px;
  height: 240px; */
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  position: relative;
`;

const Noise = styled(motion.div)`
  width: 100%;
  height: 100%;
  background-size: 128px;
  background-repeat: repeat;
  background-image: url("/images/noise.png");
  left: calc(50.00000000000002% - 100% / 2);
  opacity: 1;
  position: absolute;
  top: calc(49.95648389904267% - 100% / 2);
  width: 100%;
  /* mix-blend-mode: overlay; */
  border-radius: 12px;
  pointer-events: none;
`;

interface CopyProps {
  $accentColor: string;
}

const Role: React.FC<CopyProps> = styled(motion.h1)<CopyProps>`
  font-size: 18px;
  color: ${({ $accentColor }) => $accentColor};
`;

const Dates: React.FC<CopyProps> = styled(motion.h2)<CopyProps>`
  font-size: 12px;
  font-weight: 400;
  font-family: "Inter", sans-serif;
  text-align: center;
  background: #ffffff36;
  border-radius: 10px;
  border: 1px solid #ffffff3b;
  backdrop-filter: blur(0px);
  color: ${({ $accentColor }) => `${$accentColor}6e`};
  text-transform: uppercase;
  height: fit-content;
  padding: 2px 8px;
  white-space: nowrap;
`;

const Description: React.FC<CopyProps> = styled(motion.span)<CopyProps>`
  font-size: 14px;
  font-weight: 300;
  color: ${({ $secondaryColor }) => `${$secondaryColor}`};
`;

interface HyperlinkProps {
  $accentColor: string;
}

const Hyperlink: React.FC<HyperlinkProps> = styled(motion.a)<HyperlinkProps>`
  font-size: 18px;
  color: ${({ $accentColor }) => `${$accentColor}`};
  font-size: 14px;
  font-weight: 400;
  border-bottom: 1px solid ${({ $accentColor }) => `${$accentColor}82`};
  display: flex;
  gap: 5px;
  align-items: center;
  margin-top: auto;
`;

const Arrow = styled(motion.a)`
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const FlexRow = styled.span`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
`;

type Entry = {
  role: string;
  id: number;
  company: string;
  description: string;
  dates: string;
};

const colorMap = {
  gitbook: "rgb(237 244 255) 0%, rgb(228 226 255) 100%",
  ticketswap: "rgb(232 250 255) 0%, rgb(218 228 255) 100%",
  framer: "rgb(232 246 255) 0%, rgb(250 229 255) 100%",
};

const colorMapBorder = {
  gitbook: "rgb(223 235 255) 0%, rgb(234 233 255)  100%",
  ticketswap: "#00b6f02e 0%, #0044f02e 100%",
  framer: "rgb(213 238 255) 0%, rgb(249 227 255) 100%",
};

export default function PreviousJobCard<Props>({
  roleEntry,
  activeCompany,
  setActiveCompany,
}) {
  const {
    role,
    company,
    description,
    dates,
    id,
    accentColor,
    link,
    secondaryColor,
  } = roleEntry;

  const [hovered, setHovered] = useState(false);
  const elementRef = useRef(null);

  const variants = {
    hidden: {
      opacity: 0.2,
      background: `linear-gradient(
        135deg,
        white, white`,
    },
    show: {
      opacity: 1,
      background: `linear-gradient(
        135deg,
        ${colorMap[company]}`,
    },
  };

  const borderVariants = {
    hidden: {
      background: `linear-gradient(
        135deg,
        white, white`,
    },
    show: {
      background: `linear-gradient(
        135deg,
        ${colorMapBorder[company]}`,
    },
  };

  const offsetCard = id === 1 ? -620 : -310;
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0.55, 0.75], [0, offsetCard]);

  useEffect(() => {
    const handleScroll = () => {
      if (elementRef.current) {
        const element = elementRef.current;
        const { left, right } = element.getBoundingClientRect();
        const windowWidth =
          window.innerWidth || document.documentElement.clientWidth;

        // Calculate the center of the viewport
        const viewportCenter = windowWidth / 2;

        // Check if the element has passed the center of the viewport on the x-axis
        if (left <= viewportCenter && right >= viewportCenter) {
          setActiveCompany(company);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const overlappingCard = activeCompany === "framer" && id !== 3;

  return (
    <BorderWrapper
      variants={borderVariants}
      animate={activeCompany === company ? "show" : "hidden"}
      initial={activeCompany === company ? "show" : "hidden"}
      style={{ x: overlappingCard ? x : 0 }}
    >
      <Card
        key={roleEntry.id}
        variants={variants}
        animate={activeCompany === company ? "show" : "hidden"}
        initial={activeCompany === company ? "show" : "hidden"}
        ref={elementRef}
      >
        <FlexRow>
          <Role $accentColor={accentColor}>{role}</Role>
          <Dates $accentColor={accentColor}>{dates}</Dates>
        </FlexRow>
        <Description $secondaryColor={secondaryColor}>
          {description}
        </Description>
        <Hyperlink
          target="_blank"
          href={link}
          $accentColor={accentColor}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
        >
          Visit {company}.com
          <ArrowIcon hovered={hovered} accentColor={accentColor} />
        </Hyperlink>
        <Noise />
      </Card>
    </BorderWrapper>
  );
}

const arrowVariants = {
  default: {
    transform: "rotate(360deg)",
  },
  hovered: {
    transform: "rotate(320deg)",
  },
};

export function ArrowIcon({ hovered, accentColor }) {
  return (
    <motion.svg
      width="14"
      height="10"
      variants={arrowVariants}
      initial="default"
      animate={hovered ? "hovered" : "default"}
    >
      <motion.path
        d="M 4.75 0 L 0 4.5 L 4.75 9 M 12.75 4.5 L 0.25 4.5"
        transform="translate(0.5 0.5) rotate(180 6.375 4.5)"
        fill="transparent"
        stroke={accentColor}
        strokeMiterlimit="10"
      ></motion.path>
    </motion.svg>
  );
}

import styled from "styled-components";
import { Variants, motion } from "framer-motion";
import { useState } from "react";
import { radius, space } from "../styles/theme";

const Hyperlink = styled(motion.a)`
  position: relative;
  border-radius: ${radius["md"]};
  width: ${space[40]};
  height: ${space[40]};
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: center;
  cursor: pointer;
  background-size: contain;
`;

const backgroundMap = {
  twitter: `url("/images/gradients/twitter-gradient.png")`,
  email: `url("/images/gradients/email-gradient.png")`,
  linkedin: `url("/images/gradients/linkedin-gradient.png")`,
  github: `url("/images/gradients/github-gradient.png")`,
};

interface Props {
  text: string;
  url: string;
  variants: Variants;
}

export default function SocialButton({ text, url, variants }: Props) {
  const [hovered, setHovered] = useState(false);

  const buttonVariants = {
    default: {
      background:
        "linear-gradient(0deg, rgb(242, 242, 242, 0%) 0%, rgb(242, 242, 242, 0%) 100%)",
      opacity: 1,
      transform: "scale(1)",
      boxShadow:
        "rgba(0, 0, 0, 0) 0px 0.70659px 2.96769px -0.625px, rgba(0, 0, 0, 0) 0px 1.80656px 7.58756px -1.25px, rgba(0, 0, 0, 0.0) 0px 3.62176px 15.2114px -1.875px, rgba(0, 0, 0, 0) 0px 6.8656px 28.8355px -2.5px, rgba(0, 0, 0, 0) 0px 13.6468px 57.3164px -3.125px, rgba(0, 0, 0, 0) 0px 30px 126px -3.75px",
    },
    hovered: {
      backgroundImage: backgroundMap[text],
      opacity: 1,
      transform: "scale(1.1)",
      boxShadow:
        "rgba(0, 0, 0, 0.15) 0px 0.70659px 2.96769px -0.625px, rgba(0, 0, 0, 0.145) 0px 1.80656px 7.58756px -1.25px, rgba(0, 0, 0, 0.137) 0px 3.62176px 15.2114px -1.875px, rgba(0, 0, 0, 0.125) 0px 6.8656px 28.8355px -2.5px, rgba(0, 0, 0, 0.106) 0px 13.6468px 57.3164px -3.125px, rgba(0, 0, 0, 0.05) 0px 30px 126px -3.75px",
    },
  };

  return (
    <motion.div variants={variants}>
      <Hyperlink
        target="_blank"
        rel="noopener noreferrer"
        href={url}
        title={`Link to open my ` + text + ` profile`}
        variants={buttonVariants}
        animate={hovered ? "hovered" : "default"}
        initial={"hidden"}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        {text === "twitter" && <Twitter hovered={hovered} />}
        {text === "linkedin" && <Linkedin hovered={hovered} />}
        {text === "github" && <Github hovered={hovered} />}
        {text === "email" && <Email hovered={hovered} />}
      </Hyperlink>
    </motion.div>
  );
}

const iconVariants = {
  default: { fill: "#2e2e2e" },
  hovered: { fill: "#fff" },
};

function Twitter({ hovered }) {
  return (
    <motion.svg xmlns="http://www.w3.org/2000/svg" width="18" height="15">
      <motion.path
        d="M 17.948 1.78 C 17.277 2.088 16.563 2.288 15.833 2.378 C 16.594 1.908 17.177 1.165 17.452 0.278 C 16.73 0.72 15.939 1.031 15.113 1.198 C 14.421 0.434 13.447 -0 12.427 0 C 10.393 0 8.745 1.7 8.745 3.797 C 8.745 4.095 8.776 4.385 8.84 4.662 C 5.87 4.504 3.108 3.06 1.25 0.695 C 0.921 1.275 0.749 1.934 0.751 2.603 C 0.751 3.922 1.401 5.083 2.389 5.765 C 1.804 5.745 1.232 5.583 0.722 5.29 L 0.722 5.337 C 0.722 7.177 1.99 8.712 3.675 9.06 C 3.133 9.213 2.563 9.235 2.011 9.125 C 2.484 10.665 3.869 11.725 5.452 11.762 C 3.916 13.01 1.951 13.577 0 13.335 C 1.68 14.449 3.641 15.042 5.645 15.042 C 12.418 15.042 16.121 9.255 16.121 4.237 C 16.121 4.073 16.118 3.908 16.112 3.747 C 16.832 3.208 17.453 2.543 17.948 1.78 Z"
        animate={hovered ? "hovered" : "default"}
        initial="default"
        variants={iconVariants}
      ></motion.path>
    </motion.svg>
  );
}

function Linkedin({ hovered }) {
  return (
    <motion.svg xmlns="http://www.w3.org/2000/svg" width="16" height="16">
      <motion.path
        d="M 3.412 4.853 L 3.412 16 L 0.252 16 L 0.252 4.853 L 3.412 4.853 M 3.666 1.781 C 3.651 2.788 2.827 3.594 1.82 3.586 C 1.339 3.59 0.876 3.401 0.535 3.062 C 0.193 2.724 0 2.263 0 1.781 C 0 0.805 0.809 0 1.82 0 C 2.83 0 3.666 0.805 3.666 1.781 M 16 9.147 L 16 16 L 12.841 16 L 12.841 10.316 C 12.841 6.903 8.645 7.172 8.645 10.316 L 8.645 16 L 5.511 16 L 5.511 4.853 L 8.645 4.853 L 8.645 6.658 C 10.11 4.025 16 3.829 16 9.147"
        animate={hovered ? "hovered" : "default"}
        initial="default"
        variants={iconVariants}
      ></motion.path>
    </motion.svg>
  );
}

function Email({ hovered }) {
  return (
    <motion.svg xmlns="http://www.w3.org/2000/svg" width="18" height="16">
      <motion.path
        d="M 17.284 7.37 C 16.798 3.412 13.125 0.449 8.816 0.537 C 4.505 0.627 0.98 3.739 0.689 7.714 C 0.396 11.688 3.435 15.213 7.691 15.839 C 9.778 16.156 11.911 15.719 13.7 14.608 C 13.881 14.501 14.008 14.323 14.05 14.119 C 14.092 13.914 14.045 13.702 13.92 13.533 C 13.645 13.177 13.14 13.089 12.758 13.33 C 10.325 14.84 7.113 14.705 4.838 12.999 C 2.564 11.29 1.762 8.412 2.862 5.903 C 3.962 3.394 6.705 1.842 9.625 2.08 C 11.576 2.247 13.349 3.198 14.473 4.681 C 15.596 6.164 15.956 8.029 15.458 9.78 C 15.304 10.3 14.756 10.635 14.178 10.563 C 13.598 10.491 13.167 10.034 13.167 9.496 L 13.167 8.239 C 13.171 6.4 11.764 4.812 9.809 4.456 C 7.855 4.098 5.9 5.068 5.144 6.772 C 4.389 8.475 5.045 10.435 6.709 11.447 C 8.373 12.46 10.58 12.243 11.975 10.927 C 12.533 11.672 13.421 12.105 14.358 12.09 C 15.633 12.095 16.749 11.303 17.075 10.165 C 17.324 9.255 17.394 8.306 17.284 7.37 Z M 9 10.551 C 7.62 10.551 6.5 9.516 6.5 8.239 C 6.5 6.965 7.62 5.93 9 5.93 C 10.38 5.93 11.5 6.965 11.5 8.239 C 11.5 9.516 10.38 10.551 9 10.551 Z"
        animate={hovered ? "hovered" : "default"}
        initial="default"
        variants={iconVariants}
      ></motion.path>
    </motion.svg>
  );
}

function Github({ hovered }) {
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      style={{ transform: "scale(1.2)" }}
    >
      <motion.path
        d="M 7.5 0 C 3.356 0 0 3.356 0 7.5 C 0 10.819 2.147 13.622 5.128 14.616 C 5.503 14.681 5.644 14.456 5.644 14.259 C 5.644 14.081 5.634 13.491 5.634 12.863 C 3.75 13.209 3.262 12.403 3.113 11.981 C 3.028 11.766 2.662 11.1 2.344 10.922 C 2.081 10.781 1.706 10.434 2.334 10.425 C 2.925 10.416 3.347 10.969 3.488 11.194 C 4.163 12.328 5.241 12.009 5.672 11.813 C 5.737 11.325 5.934 10.997 6.15 10.809 C 4.481 10.622 2.737 9.975 2.737 7.106 C 2.737 6.291 3.028 5.616 3.506 5.091 C 3.431 4.903 3.169 4.134 3.581 3.103 C 3.581 3.103 4.209 2.906 5.644 3.872 C 6.244 3.703 6.881 3.619 7.519 3.619 C 8.156 3.619 8.794 3.703 9.394 3.872 C 10.828 2.897 11.456 3.103 11.456 3.103 C 11.869 4.134 11.606 4.903 11.531 5.091 C 12.009 5.616 12.3 6.281 12.3 7.106 C 12.3 9.984 10.547 10.622 8.878 10.809 C 9.15 11.044 9.384 11.494 9.384 12.197 C 9.384 13.2 9.375 14.006 9.375 14.259 C 9.375 14.456 9.516 14.691 9.891 14.616 C 12.853 13.622 15 10.809 15 7.5 C 15 3.356 11.644 0 7.5 0 Z"
        animate={hovered ? "hovered" : "default"}
        initial="default"
        variants={iconVariants}
      ></motion.path>
    </motion.svg>
  );
}

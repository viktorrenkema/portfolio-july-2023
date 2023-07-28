import { motion } from "framer-motion";

export const ArrowRounded = ({ colors, company }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23">
      <path
        d="M 11.5 0 C 5.149 0 0 5.149 0 11.5 C 0 17.851 5.149 23 11.5 23 C 17.851 23 23 17.851 23 11.5 C 22.993 5.151 17.849 0.007 11.5 0 Z"
        fill={colors[company][2]}
      ></path>
      <path
        d="M 16.357 12.042 L 12.819 15.58 C 12.472 15.92 11.917 15.917 11.574 15.574 C 11.231 15.231 11.228 14.676 11.567 14.329 L 13.596 12.301 L 6.885 12.301 C 6.396 12.301 6 11.905 6 11.416 C 6 10.928 6.396 10.531 6.885 10.531 L 13.595 10.531 L 11.568 8.503 C 11.229 8.157 11.232 7.602 11.575 7.259 C 11.918 6.916 12.473 6.913 12.82 7.252 L 16.358 10.79 C 16.611 11.044 16.686 11.425 16.55 11.755 C 16.505 11.863 16.44 11.96 16.358 12.042 Z"
        fill={colors[company][0]}
      ></path>
    </svg>
  );
};

const arrowVariants = {
  default: {
    transform: "rotate(360deg)",
  },
  hovered: {
    transform: "rotate(320deg)",
  },
};

export const Arrow = ({ hovered }) => {
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
        stroke="#0055ff"
        strokeMiterlimit="10"
      ></motion.path>
    </motion.svg>
  );
};

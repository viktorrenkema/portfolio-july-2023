import { motion } from "framer-motion";

export const ArrowInCircle = ({ colors, company, color }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="23" height="23">
      <path
        d="M 11.5 0 C 5.149 0 0 5.149 0 11.5 C 0 17.851 5.149 23 11.5 23 C 17.851 23 23 17.851 23 11.5 C 22.993 5.151 17.849 0.007 11.5 0 Z"
        fill={colors[2] || colors[company][2]}
      ></path>
      <path
        d="M 16.357 12.042 L 12.819 15.58 C 12.472 15.92 11.917 15.917 11.574 15.574 C 11.231 15.231 11.228 14.676 11.567 14.329 L 13.596 12.301 L 6.885 12.301 C 6.396 12.301 6 11.905 6 11.416 C 6 10.928 6.396 10.531 6.885 10.531 L 13.595 10.531 L 11.568 8.503 C 11.229 8.157 11.232 7.602 11.575 7.259 C 11.918 6.916 12.473 6.913 12.82 7.252 L 16.358 10.79 C 16.611 11.044 16.686 11.425 16.55 11.755 C 16.505 11.863 16.44 11.96 16.358 12.042 Z"
        fill={colors[0] || colors[company][0]}
      ></path>
    </svg>
  );
};

const arrowVariants = {
  default: {
    transform: "rotate(320deg)",
  },
  hovered: {
    transform: "rotate(360deg)",
  },
};

export const Arrow = ({ hovered, color }) => {
  console.log(hovered);
  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      width="17"
      height="15"
      variants={arrowVariants}
      initial="default"
      animate={hovered ? "hovered" : "default"}
    >
      <motion.path
        d="M 13.549 8.126 L 10.011 11.664 C 9.664 12.003 9.109 12 8.766 11.658 C 8.423 11.315 8.42 10.76 8.759 10.413 L 10.788 8.385 L 4.077 8.385 C 3.588 8.385 3.192 7.989 3.192 7.5 C 3.192 7.011 3.588 6.615 4.077 6.615 L 10.787 6.615 L 8.76 4.587 C 8.421 4.24 8.424 3.685 8.767 3.342 C 9.11 3 9.665 2.997 10.012 3.336 L 13.55 6.874 C 13.803 7.128 13.878 7.508 13.742 7.839 C 13.697 7.946 13.632 8.044 13.55 8.126 Z"
        fill={color || "#0055ff"}
      ></motion.path>
    </motion.svg>
  );
};

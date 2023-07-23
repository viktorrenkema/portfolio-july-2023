import { motion } from "framer-motion";

export function ArrowRounded({ color }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="30"
      height="30"
      viewBox="0 0 30 30"
      fill="none"
    >
      <path
        d="M15 2.8125C12.5895 2.8125 10.2332 3.52728 8.22899 4.86646C6.22477 6.20564 4.66267 8.10907 3.74022 10.336C2.81778 12.563 2.57643 15.0135 3.04668 17.3777C3.51694 19.7418 4.67769 21.9134 6.38214 23.6179C8.08659 25.3223 10.2582 26.4831 12.6223 26.9533C14.9865 27.4236 17.437 27.1822 19.664 26.2598C21.8909 25.3373 23.7944 23.7752 25.1335 21.771C26.4727 19.7668 27.1875 17.4105 27.1875 15C27.1841 11.7687 25.899 8.67077 23.6141 6.3859C21.3292 4.10104 18.2313 2.81591 15 2.8125ZM20.3508 15.6633L16.6008 19.4133C16.4249 19.5892 16.1863 19.688 15.9375 19.688C15.6887 19.688 15.4501 19.5892 15.2742 19.4133C15.0983 19.2374 14.9995 18.9988 14.9995 18.75C14.9995 18.5012 15.0983 18.2626 15.2742 18.0867L17.4246 15.9375H10.3125C10.0639 15.9375 9.82541 15.8387 9.64959 15.6629C9.47378 15.4871 9.37501 15.2486 9.37501 15C9.37501 14.7514 9.47378 14.5129 9.64959 14.3371C9.82541 14.1613 10.0639 14.0625 10.3125 14.0625H17.4246L15.2742 11.9133C15.0983 11.7374 14.9995 11.4988 14.9995 11.25C14.9995 11.0012 15.0983 10.7626 15.2742 10.5867C15.4501 10.4108 15.6887 10.312 15.9375 10.312C16.1863 10.312 16.4249 10.4108 16.6008 10.5867L20.3508 14.3367C20.438 14.4238 20.5071 14.5272 20.5543 14.641C20.6015 14.7548 20.6257 14.8768 20.6257 15C20.6257 15.1232 20.6015 15.2452 20.5543 15.359C20.5071 15.4728 20.438 15.5762 20.3508 15.6633Z"
        fill={color}
      />
    </svg>
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

export function Arrow({ hovered, accentColor }) {
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
        stroke="#7d7d7d"
        // stroke={accentColor}
        strokeMiterlimit="10"
      ></motion.path>
    </motion.svg>
  );
}

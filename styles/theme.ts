import { keyframes } from "styled-components";

export const shadows = {
  small:
    "0px 0.6021873017743928px 0.6021873017743928px -1.25px rgba(0, 0, 0, 0.18), 0px 2.288533303243457px 2.288533303243457px -2.5px rgba(0, 0, 0, 0.15889), 0px 10px 10px -3.75px rgba(0, 0, 0, 0.175)",
  medium:
    "0px 0.6021873017743928px 0.6021873017743928px -1.25px rgba(0, 0, 0, 0.18), 0px 2.288533303243457px 2.288533303243457px -2.5px rgba(0, 0, 0, 0.15889), 3px 3px 10px 0px rgb(0 0 0 / 3%), -3px -3px 10px 0px rgb(0 0 0 / 3%)",
  large:
    "rgba(0, 0, 0, 0.07) 2.2px 2.2px 16.9px, rgba(0, 0, 0, 0.067) 5.1px 5.1px 44.4px, rgba(0, 0, 0, 0.07) 10px 10px 136px",
};

export const colors = {
  black: "#000",
  white: "#fff",
  gitbook: "#90b0ff",
  ticketswap: "#0099ff",
  blue: "#0055ff",
  darkest: "#11131f",
  light: "#b4b4b4",
  lightest: "#fff",
  avatarLighter: "#EBDAFF",
  avatarDarker: "#C1BFFF",
  // The card background/border effect
  cardBorderBackground: "#ffffff4a",
  // The cards within it
  cardBackground: "rgb(250 250 250 / 90%)",
};

export const fontSize = {
  10: "0.625rem",
  12: "0.75rem",
  13: "0.8125rem",
  14: "0.875rem",
  16: "1rem",
  18: "1.125rem",
  20: "1.25rem",
  22: "1.375rem",
  24: "1.5rem",
  28: "1.75rem",
  32: "2rem",
  56: "3.5rem",
};

export const space = {
  0: "0",
  4: "0.25rem",
  8: "0.5rem",
  12: "0.75rem",
  16: "1rem",
  24: "1.5rem",
  32: "2rem",
  40: "2.5rem",
  44: "2.75rem",
  48: "3rem",
  56: "3.5rem",
  64: "4rem",
  80: "5rem",
  88: "5.5rem",
  96: "6rem",
  128: "8rem",
  144: "9rem",
  256: "16rem",
  512: "32rem",
  768: "48rem",
};

export const radius = {
  sm: space[4],
  md: space[8],
  lg: space[12],
  xl: space[16],
};

export const fontWeight = {
  light: 300,
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
};

export const sizes = {
  mobile: 320,
  mobileM: 375,
  mobileL: 425,
  tablet: 768,
  laptop: 1024,
  laptopM: 1280,
  laptopL: 1440,
  desktop: 1880,
};

export const device = {
  mobile: `(min-width: ${sizes.mobile / 16}em)`,
  mobileM: `(min-width: ${sizes.mobileM / 16}em)`,
  mobileL: `(min-width: ${sizes.mobileL / 16}em)`,
  tablet: `(min-width: ${sizes.tablet / 16}em)`,
  laptop: `(min-width: ${sizes.laptop / 16}em)`,
  laptopM: `(min-width: ${sizes.laptopM / 16}em)`,
  laptopL: `(min-width: ${sizes.laptopL / 16}em)`,
  desktop: `(min-width: ${sizes.desktop / 16}em)`,
};

export const backgroundAnimation = keyframes`
0% {
		background-position: 0% 50%;
	}
	50% {
		background-position: 100% 50%;
	}
	100% {
		background-position: 0% 50%;
	}
`;

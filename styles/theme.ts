import { keyframes } from "styled-components";

export const colors = {
  darkest: "#11131f",
  light: "#b4b4b4",
  lightest: "#fff",
  avatarLighter: "#EBDAFF",
  avatarDarker: "#C1BFFF",
};

export const fontSize = {
  10: "0.625rem",
  12: "0.75rem",
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

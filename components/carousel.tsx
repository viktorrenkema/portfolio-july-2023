import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { styled } from "styled-components";
import CompanyLogo from "./company-logo";
import PreviousJobCard from "./previous-job-card";

const Row = styled(motion.ul)`
  display: flex;
  margin-right: 30px;
  gap: 20px;
  will-change: transform;
  list-style-type: none;
`;

const CarouselWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow: hidden;
  flex-wrap: nowrap;
  align-items: center;
`;

const Companies = styled(motion.div)`
  display: flex;
  gap: 2rem;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
`;

const FramerText = styled.span`
  font-weight: 700;
  color: #000000;
  font-size: 32px;
`;

const cardWidth = 385;

const variants = {
  active: {
    opacity: 1,
    filter: "grayscale(0)",
  },
  inactive: {
    opacity: 0.2,
    filter: "grayscale(1)",
  },
};

export const Carousel = () => {
  const [activeCompany, setActiveCompany] = useState("gitbook");
  const [startAndEndOfSticky, setStartAndEndOfSticky] = useState([0, 0]);
  const { scrollYProgress } = useScroll();

  const ref = useRef();

  useEffect(() => {
    const refElement = ref.current;
    const { top, height, width } = refElement.getBoundingClientRect();

    console.log(height);

    const documentHeight =
      document.documentElement.scrollHeight || document.body.scrollHeight;

    const refPercentageStart = top / (documentHeight - height) + 0.05;
    const refPercentageEnd = (top + width + height) / documentHeight;

    setStartAndEndOfSticky([refPercentageStart, refPercentageEnd]);
  }, []);

  const roles = [
    {
      role: "Product Engineer",
      id: 5,
      company: "gitbook",
      description:
        "I work on the product team at Gitbook, where I build features that help our users create and share knowledge.",
      dates: "2023 - Present",
      link: "https://www.gitbook.com",
      accentColor: "#445379",
      secondaryColor: "#232b3f",
    },
    {
      role: "Frontend Engineer",
      id: 4,
      company: "ticketswap",
      description:
        "Within my team we had full responsibility over the buy-flow on the platform. We worked on features like ticket personalization, allowing custom currencies, and much more.",
      dates: "May 2022 - June 2023",
      link: "https://www.ticketswap.com",
      accentColor: "#21498d",
      secondaryColor: "#122649",
    },
    {
      role: "Lead Product Specialist",
      id: 3,
      company: "framer",
      description:
        "As lead, I was responsible for our top Enterprise teams like Microsoft, Airbnb, Spotify, Shopify, Amazon, and many more. Next to regular product specialist tasks, I also focused on long-term strategy for the team.",
      dates: "Oct. 2021 - Apr. 2022",
      link: "https://www.framer.com",
      accentColor: "#322148",
      secondaryColor: "#37254e",
    },
    {
      role: "Product Specialist",
      id: 2,
      company: "framer",
      description:
        "I helped unlock our Enterprise teams to get the most out of design and code features in Framer, like building a React gamepad component for Rockstar or getting Airbus' design system into Framer.",
      dates: "Jan. 2020 - Oct. 2021",
      link: "https://www.framer.com",
      accentColor: "#322148",
      secondaryColor: "#37254e",
    },
    {
      role: "Community & Support",
      id: 1,
      company: "framer",
      description:
        "At Framer I started out in a role dedicated to writing tutorials, recording videos, and providing project support.",
      dates: "Apr. 2019 - Dec. 2019",
      link: "https://www.framer.com",
      accentColor: "#322148",
      secondaryColor: "#37254e",
    },
  ];

  const x = useTransform(
    scrollYProgress,
    [startAndEndOfSticky[0], 1],
    [908, -(cardWidth * (roles.length - 1.5))]
    // 908 used to be 800 with 375x240px old size of previous-job-card
  );

  const logosX = useTransform(
    scrollYProgress,
    [startAndEndOfSticky[0], 0.5],
    [272, -272]
  );

  return (
    <CarouselWrapper ref={ref}>
      <Companies style={{ x: logosX }}>
        <CompanyLogo
          animate={activeCompany === "gitbook" ? "active" : "inactive"}
          initial={activeCompany === "gitbook" ? "active" : "inactive"}
          variants={variants}
          tint="rgba(144, 176, 255, 0.2) 0%, hsla(203, 100%, 78%, 0.2) 100%"
          logo={<GitbookLogo />}
        />
        <CompanyLogo
          tint="rgba(0, 182, 240, 0.2) 0%, hsla(223, 100%, 47%, 0.2) 100%"
          animate={activeCompany === "ticketswap" ? "active" : "inactive"}
          initial={activeCompany === "ticketswap" ? "active" : "inactive"}
          variants={variants}
          logo={<TicketswapLogo />}
        />
        <CompanyLogo
          tint="#0099ff2e 0%, #cc00ff33 100%"
          animate={activeCompany === "framer" ? "active" : "inactive"}
          initial={activeCompany === "framer" ? "active" : "inactive"}
          variants={variants}
          logo={<FramerLogo />}
        />
      </Companies>
      <Row style={{ x }}>
        {roles.map((roleEntry) => {
          return (
            <PreviousJobCard
              roleEntry={roleEntry}
              activeCompany={activeCompany}
              setActiveCompany={setActiveCompany}
            />
          );
        })}
      </Row>
    </CarouselWrapper>
  );
};

function FramerLogo() {
  return (
    <>
      <svg xmlns="http://www.w3.org/2000/svg" width="27" height="39">
        <path
          d="M 25.848 24.891 C 26.041 25.074 26.099 25.356 25.994 25.599 C 25.887 25.843 25.642 26.001 25.371 26 L 14.175 26 C 13.998 25.998 13.827 26.066 13.7 26.188 C 13.574 26.31 13.502 26.476 13.5 26.65 L 13.5 37.431 C 13.5 37.694 13.336 37.931 13.083 38.031 C 12.831 38.132 12.543 38.077 12.348 37.891 L 0.263 26.253 C 0.095 26.092 0 25.871 0 25.64 L 0 13.65 C 0 13.291 0.303 13 0.675 13 L 13.5 13 Z M 13.5 13 L 1.152 1.109 C 0.96 0.926 0.902 0.645 1.006 0.402 C 1.113 0.157 1.358 -0.001 1.629 0 L 26.325 0 C 26.697 0 27 0.291 27 0.65 L 27 12.35 C 26.998 12.524 26.926 12.69 26.8 12.812 C 26.673 12.934 26.502 13.002 26.325 13 Z"
          fill="#000000"
        ></path>
      </svg>
      <FramerText>Framer</FramerText>
    </>
  );
}

function GitbookLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="173" height="38">
      <path
        d="M 30.488 0.474 L 48.165 9.321 C 48.982 9.729 48.995 10.892 48.187 11.318 L 25.229 23.446 C 23.949 24.122 22.421 24.139 21.127 23.491 L 6.712 16.277 C 4.956 15.571 2.992 16.861 2.992 18.803 C 2.992 20.365 3.874 21.793 5.269 22.491 L 19.721 29.724 C 20.604 28.825 21.832 28.267 23.19 28.267 C 24.51 28.267 25.707 28.793 26.583 29.647 L 44.584 20.139 C 44.533 19.856 44.508 19.57 44.508 19.282 C 44.508 16.595 46.685 14.416 49.371 14.416 C 52.056 14.416 54.233 16.595 54.233 19.282 C 54.233 21.97 52.056 24.149 49.371 24.149 C 48.058 24.149 46.866 23.628 45.991 22.781 L 27.981 32.295 C 28.028 32.568 28.053 32.848 28.053 33.133 C 28.053 35.821 25.876 38 23.19 38 C 20.505 38 18.328 35.821 18.328 33.133 C 18.328 32.885 18.347 32.641 18.383 32.402 L 3.722 25.065 C 1.441 23.924 0 21.59 0 19.038 L 0 17.617 C -0 15.673 1.075 13.889 2.792 12.981 L 26.386 0.519 C 27.666 -0.157 29.193 -0.174 30.488 0.474 Z M 23.19 35.005 C 24.223 35.005 25.061 34.167 25.061 33.133 C 25.061 32.1 24.223 31.262 23.19 31.262 C 22.158 31.262 21.32 32.1 21.32 33.133 C 21.32 34.167 22.158 35.005 23.19 35.005 Z"
        fill="#90b0ff"
      ></path>
      <path
        d="M 92.213 11.743 C 92.213 12.836 91.327 13.722 90.235 13.722 C 89.143 13.722 88.257 12.836 88.257 11.743 C 88.257 10.65 89.143 9.764 90.235 9.764 C 91.327 9.764 92.213 10.65 92.213 11.743 Z M 88.588 15.042 L 88.588 29.555 L 91.884 29.555 L 91.884 15.042 Z M 96.497 25.434 C 96.497 28.191 97.741 29.555 100.644 29.555 L 103.088 29.555 L 103.088 26.739 L 101.363 26.739 C 100.207 26.739 99.793 26.294 99.793 25.108 L 99.793 17.68 L 103.088 17.68 L 103.088 15.042 L 99.793 15.042 L 99.793 10.424 L 96.497 10.424 L 96.497 15.042 L 93.86 15.042 L 93.86 17.68 L 96.497 17.68 Z M 105.725 8.444 L 105.725 29.556 L 113.605 29.556 C 118.611 29.556 121.25 26.994 121.25 23.466 C 121.25 20.442 119.521 19.309 116.766 18.835 C 119.225 18.301 120.508 16.539 120.508 14.019 C 120.508 10.609 117.9 8.444 113.338 8.444 Z M 109.132 11.291 L 113.427 11.291 C 115.797 11.291 117.101 12.596 117.101 14.434 C 117.101 16.302 115.768 17.681 113.427 17.681 L 109.132 17.681 Z M 109.132 20.319 L 113.635 20.319 C 116.271 20.319 117.754 21.242 117.754 23.288 C 117.754 25.393 116.36 26.679 113.635 26.679 L 109.132 26.679 Z M 131.102 29.555 C 135.829 29.555 139.012 26.383 139.012 21.639 C 139.012 16.925 135.829 13.722 131.102 13.722 C 126.375 13.722 123.192 16.925 123.192 21.639 C 123.192 26.383 126.375 29.555 131.102 29.555 Z M 131.102 26.776 C 128.344 26.776 126.556 24.63 126.556 21.639 C 126.556 18.647 128.344 16.502 131.102 16.502 C 133.86 16.502 135.678 18.647 135.678 21.639 C 135.678 24.63 133.86 26.776 131.102 26.776 Z M 148.899 29.555 C 153.626 29.555 156.809 26.383 156.809 21.639 C 156.809 16.925 153.626 13.722 148.899 13.722 C 144.171 13.722 140.989 16.925 140.989 21.639 C 140.989 26.383 144.171 29.555 148.899 29.555 Z M 148.899 26.776 C 146.141 26.776 144.353 24.63 144.353 21.639 C 144.353 18.647 146.141 16.502 148.899 16.502 C 151.656 16.502 153.475 18.647 153.475 21.639 C 153.475 24.63 151.656 26.776 148.899 26.776 Z M 164.516 22.647 L 161.985 25.493 L 161.985 29.555 L 158.786 29.555 L 158.786 8.444 L 161.985 8.444 L 161.985 21.609 L 169.255 13.722 L 172.957 13.722 L 166.797 20.305 L 172.957 29.555 L 169.166 29.555 Z M 76.641 29.555 C 70.835 29.555 66.836 25.315 66.836 19 C 66.836 12.684 70.746 8.444 76.908 8.444 C 81.47 8.444 84.721 11.017 85.641 15.042 L 82.191 15.042 C 81.366 12.785 79.453 11.439 76.819 11.439 C 72.879 11.439 70.331 14.552 70.331 19 C 70.331 23.447 72.82 26.561 76.79 26.561 C 79.989 26.561 82.566 24.752 82.744 21.402 L 82.744 20.319 L 76.723 20.319 L 76.723 17.681 L 85.951 17.681 L 85.951 29.555 L 83.426 29.555 L 83.07 26.413 C 82.063 27.895 79.929 29.555 76.641 29.555 Z"
        fill="#90b0ff"
      ></path>
      <path
        d="M 51.241 19.282 C 51.241 20.316 50.404 21.154 49.371 21.154 C 48.338 21.154 47.501 20.316 47.501 19.282 C 47.501 18.249 48.338 17.411 49.371 17.411 C 50.404 17.411 51.241 18.249 51.241 19.282 Z"
        fill="hsl(0, 0%, 100%)"
      ></path>
    </svg>
  );
}

function TicketswapLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="220" height="37">
      <path
        d="M 30.388 21.2 C 31.023 20.579 31.476 19.795 31.697 18.934 L 40.993 28.189 C 40.492 28.871 39.935 29.509 39.328 30.099 C 32.43 36.988 21.215 36.989 14.293 30.099 L 0 15.85 L 6.259 9.624 C 6.968 8.91 7.932 8.508 8.938 8.508 C 9.944 8.508 10.908 8.91 11.617 9.624 L 23.246 21.2 C 24.193 22.147 25.478 22.679 26.817 22.679 C 28.156 22.679 29.441 22.147 30.388 21.2 Z M 39.328 5.164 L 53.632 19.414 L 47.378 25.659 C 45.892 27.13 43.499 27.13 42.013 25.659 L 30.388 14.066 C 28.41 12.109 25.224 12.109 23.246 14.066 C 22.619 14.693 22.167 15.473 21.936 16.329 L 12.642 7.074 C 13.148 6.401 13.7 5.763 14.293 5.164 C 21.215 -1.721 32.43 -1.721 39.328 5.164 Z M 203.564 36.065 L 203.564 12.562 L 207.552 12.562 L 207.552 13.702 C 208.795 12.691 210.247 12.274 211.836 12.274 C 216.378 12.274 220 15.836 220 20.278 C 220 24.708 216.378 28.318 211.836 28.318 C 210.247 28.318 208.796 27.9 207.552 26.908 L 207.552 36.066 L 203.564 36.066 Z M 196.911 27.899 L 196.911 26.906 C 195.687 27.899 194.224 28.316 192.644 28.316 C 188.103 28.316 184.475 24.707 184.475 20.277 C 184.475 15.835 188.103 12.273 192.645 12.273 C 194.205 12.273 195.662 12.69 196.911 13.701 L 196.911 12.561 L 200.905 12.561 L 200.905 27.899 Z M 175.018 27.899 L 171.56 18.112 L 168.23 27.899 L 164.086 27.899 L 158.602 12.562 L 163.076 12.562 L 166.185 22.639 L 169.815 12.562 L 173.315 12.562 L 176.873 22.639 L 180.024 12.562 L 184.519 12.562 L 178.985 27.9 L 175.017 27.9 Z M 148.184 23.12 C 149.605 24.352 151.321 24.707 152.422 24.707 C 153.849 24.707 154.3 24.127 154.3 23.584 C 154.3 21.29 146.489 22.704 146.489 17.183 C 146.489 14.375 148.506 12.273 151.929 12.273 C 153.301 12.273 155.788 12.593 157.543 14.214 L 155.433 17.053 C 154.072 16.123 152.808 15.899 151.963 15.899 C 150.635 15.899 150.376 16.475 150.376 16.863 C 150.376 19.028 158.089 17.984 158.089 23.456 C 158.089 26.261 156.044 28.316 152.165 28.316 C 149.303 28.316 147.465 27.226 146.071 26.166 Z M 143.61 27.931 C 143.61 27.931 142.446 28.316 140.537 28.316 C 137.529 28.316 135.963 26.358 135.963 23.343 L 135.963 16.379 L 133.532 16.379 L 133.532 12.562 L 135.963 12.562 L 135.963 7.366 L 139.959 7.366 L 139.959 12.561 L 144.039 12.561 L 144.039 16.379 L 139.959 16.379 L 139.959 22.507 C 139.959 23.584 140.248 24.576 141.675 24.576 C 142.679 24.576 143.61 24.416 143.61 24.416 Z M 121.065 21.547 C 121.517 23.424 123.037 24.737 125.34 24.737 C 126.745 24.737 128.23 24.224 129.13 23.024 L 131.853 25.188 C 130.459 27.162 127.993 28.316 125.37 28.316 C 120.733 28.316 117.166 24.869 117.166 20.373 C 117.166 16.027 120.253 12.273 125.148 12.273 C 129.675 12.273 132.889 15.963 132.889 20.277 C 132.889 20.714 132.859 21.161 132.793 21.547 Z M 113.119 27.899 L 107.037 21.066 L 107.037 27.899 L 103.05 27.899 L 103.05 4.012 L 107.037 4.012 L 107.037 18.514 L 112.605 12.561 L 117.723 12.561 L 110.991 19.573 L 118.38 27.899 Z M 101.435 24.546 C 99.997 26.811 97.408 28.316 94.462 28.316 C 89.918 28.316 86.288 24.707 86.288 20.277 C 86.288 15.835 89.918 12.273 94.462 12.273 C 97.374 12.273 99.913 13.733 101.369 15.931 L 97.961 17.888 C 97.156 16.756 95.85 16.086 94.461 16.091 C 92.137 16.091 90.221 18.016 90.221 20.277 C 90.221 22.573 92.137 24.513 94.461 24.513 C 95.981 24.513 97.309 23.743 98.061 22.541 Z M 80.445 27.899 L 80.445 12.562 L 84.443 12.562 L 84.443 27.9 L 80.446 27.9 Z M 79.932 7.493 C 79.932 6.082 81.022 5.006 82.462 5.006 C 83.883 5.006 84.956 6.081 84.956 7.493 C 84.957 8.919 83.884 10.012 82.463 10.012 C 81.023 10.012 79.932 8.919 79.932 7.493 Z M 76.751 27.932 C 76.751 27.932 75.594 28.317 73.678 28.317 C 70.668 28.317 69.102 26.359 69.102 23.344 L 69.102 16.38 L 66.672 16.38 L 66.672 12.562 L 69.102 12.562 L 69.102 7.366 L 73.1 7.366 L 73.1 12.561 L 77.18 12.561 L 77.18 16.379 L 73.1 16.379 L 73.1 22.507 C 73.1 23.584 73.386 24.576 74.814 24.576 C 75.809 24.576 76.751 24.416 76.751 24.416 L 76.751 27.931 Z M 207.552 20.472 C 207.653 22.672 209.532 24.514 211.836 24.514 C 214.169 24.514 216.072 22.574 216.072 20.278 C 216.072 18.018 214.169 16.092 211.836 16.092 C 209.533 16.092 207.653 17.953 207.552 20.118 L 207.552 20.473 Z M 192.644 16.092 C 190.314 16.092 188.402 18.017 188.402 20.278 C 188.402 22.574 190.313 24.514 192.644 24.514 C 195.014 24.514 196.911 22.574 196.911 20.278 C 196.911 18.018 195.013 16.092 192.644 16.092 Z M 128.873 18.644 C 128.648 17.087 127.021 15.9 125.113 15.9 C 123.261 15.9 121.773 16.99 121.195 18.644 L 128.872 18.644 Z"
        fill="#0099ff"
      ></path>
    </svg>
  );
}

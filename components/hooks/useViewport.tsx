import { useState, useEffect } from "react";

const useViewport = () => {
  const [viewportWidth, setViewportWidth] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isLarge, setIsLarge] = useState(false);
  const [isXLarge, setIsXLarge] = useState(false);

  useEffect(() => {
    const handleWindowResize = () => {
      setViewportWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 425);
      setIsTablet(window.innerWidth >= 425 && window.innerWidth < 768);
      setIsLarge(window.innerWidth >= 1440);
      setIsXLarge(window.innerWidth >= 2560);
    };

    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);

    // Cleanup the event listener on unmount
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  useEffect(() => {
    if (viewportWidth !== null) {
      setIsMobile(viewportWidth < 425);
      setIsTablet(viewportWidth >= 425 && window.innerWidth < 768);
      setIsLarge(viewportWidth >= 1440);
      setIsXLarge(viewportWidth >= 2560);
    }
  }, [viewportWidth]);

  // Mapping based on linear interpolation
  const x1 = 350,
    y1 = 252,
    x2 = 867,
    y2 = 638;
  let height = y1 + ((viewportWidth - x1) * (y2 - y1)) / (x2 - x1);

  return {
    isMobile,
    isTablet,
    isLarge,
    isXLarge,
    viewportWidth,
    calculatedImageHeight: Math.floor(height),
  };
};

export default useViewport;

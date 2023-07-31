import { useState, useEffect } from "react";

const useViewport = () => {
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkViewportForMobile = () => {
      if (window.innerWidth < 425) {
        setIsMobile(true);
      }
      if (isMobile && window.innerWidth >= 425) {
        setIsMobile(false);
      }
    };

    const handleWindowResize = () => {
      setViewportWidth(window.innerWidth);
      checkViewportForMobile();
    };

    checkViewportForMobile();
    handleWindowResize(); // calling the function here for initial render
    window.addEventListener("resize", handleWindowResize);

    // Cleanup the event listener on unmount
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  // Mapping based on linear interpolation
  const x1 = 350,
    y1 = 252,
    x2 = 867,
    y2 = 638;
  let height = y1 + ((viewportWidth - x1) * (y2 - y1)) / (x2 - x1);

  return {
    isMobile,
    viewportWidth,
    calculatedImageHeight: Math.floor(height),
  };
};

export default useViewport;

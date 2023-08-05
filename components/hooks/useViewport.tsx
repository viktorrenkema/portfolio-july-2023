import { useState, useEffect } from "react";

const useViewport = () => {
  const [viewportWidth, setViewportWidth] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setViewportWidth(window.innerWidth);
    const handleWindowResize = () => {
      setViewportWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 425);
    };

    handleWindowResize();
    window.addEventListener("resize", handleWindowResize);

    // Cleanup the event listener on unmount
    return () => window.removeEventListener("resize", handleWindowResize);
  }, []);

  useEffect(() => {
    if (viewportWidth !== null) {
      setIsMobile(viewportWidth < 425);
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
    viewportWidth,
    calculatedImageHeight: Math.floor(height),
  };
};

export default useViewport;

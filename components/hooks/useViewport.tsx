import { useState, useEffect } from "react";

const useViewport = () => {
  const [viewportWidth, setViewportWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0
  );

  useEffect(() => {
    const handleWindowResize = () => {
      setViewportWidth(window.innerWidth);
    };

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

  return { viewportWidth, calculatedImageHeight: Math.floor(height) };
};

export default useViewport;

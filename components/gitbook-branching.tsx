import { motion } from "framer-motion";
import { useState } from "react";
import useViewport from "./hooks/useViewport";

export default function GitbookBranching() {
  const [startFirstNode, setStartFirstNode] = useState(false);
  const [startSecondNode, setStartSecondNode] = useState(false);
  const [startThirdNode, setStartThirdNode] = useState(false);
  const { isMobile, viewportWidth } = useViewport();

  if (viewportWidth === null) {
    return null;
  }

  const handleUpdateMainBranch = (latest) => {
    if (isMobile) {
      if (latest.pathLength > 0.4) {
        return setStartFirstNode(true);
      }

      if (latest.pathLength <= 0.05) {
        return setStartFirstNode(false);
      }
    }

    if (latest.pathLength > 0.5) {
      setStartFirstNode(true);
    }

    if (latest.pathLength <= 0.05) {
      setStartFirstNode(false);
    }
  };

  const handleUpdateSecondBranch = (latest) => {
    if (latest.pathLength > 0.47) {
      setStartSecondNode(true);
    }

    if (latest.pathLength <= 0.05) {
      setStartSecondNode(false);
    }
  };

  const handleUpdateThirdBranch = (latest) => {
    if (latest.pathLength > 0.9) {
      setStartThirdNode(true);
    }

    if (latest.pathLength <= 0.05) {
      setStartThirdNode(false);
    }
  };

  const nodeVariants = {
    hidden: {
      opacity: 0,
      transition: {
        duration: 0.01,
      },
    },
    show: {
      opacity: 1,
    },
  };

  const branchVariants = {
    hidden: {
      pathLength: 0,
      transition: {
        duration: 0.01,
      },
    },
    show: {
      pathLength: 1,
    },
  };

  if (isMobile) {
    return (
      <>
        {/* Main branch */}
        <motion.svg
          width="355"
          height="3"
          viewBox="0 0 355 3"
          fill="none"
          style={{ position: "absolute", left: "1px", bottom: "10px" }}
        >
          <motion.path
            d="M-1 1.5L355 1.92381"
            stroke="#E47F80"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            fill="none"
            transition={{
              duration: 5,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: 1,
            }}
            onUpdate={handleUpdateMainBranch}
          />
        </motion.svg>

        {/* Second branching */}
        <motion.svg
          width="207"
          height="28"
          viewBox="0 0 207 28"
          fill="none"
          strokeWidth="2"
          style={{ position: "absolute", left: "148px", bottom: "10px" }}
        >
          <motion.path
            d="M1 26.5L18.9991 2.96275C19.9451 1.72566 21.4135 1 22.9709 1H164H207.5"
            stroke="#E581CA"
            onUpdate={handleUpdateSecondBranch}
            animate={startFirstNode ? "show" : "hidden"}
            initial={"hidden"}
            variants={branchVariants}
            transition={{
              duration: 2.5,
              ease: "linear",
            }}
          />
        </motion.svg>

        {/* First node */}
        <motion.svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          style={{ position: "absolute", left: "145px", bottom: "7px" }}
          animate={startFirstNode ? "show" : "hidden"}
          initial={"hidden"}
          variants={nodeVariants}
        >
          <motion.circle
            cx="4"
            cy="4"
            r="3.5"
            fill="#fafafa"
            stroke="#E47F80"
          />
        </motion.svg>

        {/* Third branching */}
        <motion.svg
          width="113"
          height="23"
          viewBox="0 0 113 23"
          fill="none"
          strokeWidth="2"
          style={{ position: "absolute", left: "234px", bottom: "37px" }}
        >
          <motion.path
            animate={startSecondNode ? "show" : "hidden"}
            initial={"hidden"}
            variants={branchVariants}
            transition={{
              duration: 1.5,
              ease: "linear",
            }}
            d="M1 21.5L7.5 12.5L13.1129 4.43149C14.6084 2.28172 17.0613 1 19.6801 1H93.3199C95.9387 1 98.3916 2.28172 99.8871 4.43148L105.5 12.5L111.5 21.5"
            stroke="#B181E3"
            onUpdate={handleUpdateThirdBranch}
          />
        </motion.svg>

        {/* Second node */}
        <motion.svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          style={{ position: "absolute", left: "230px", bottom: "32px" }}
          variants={nodeVariants}
          animate={startSecondNode ? "show" : "hidden"}
          initial={"hidden"}
        >
          <motion.circle
            cx="4"
            cy="4"
            r="3.5"
            fill="#fafafa"
            stroke="#B181E3"
          />
        </motion.svg>

        {/* Third node */}
        <motion.svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          style={{ position: "absolute", left: "342px", bottom: "32px" }}
          variants={nodeVariants}
          animate={startThirdNode ? "show" : "hidden"}
          initial={"hidden"}
        >
          <motion.circle
            cx="4"
            cy="4"
            r="3.5"
            fill="#fafafa"
            stroke="#B181E3"
          />
        </motion.svg>
      </>
    );
  }

  if (!isMobile) {
    return (
      <>
        {/* Main branch */}
        <motion.svg
          width="420"
          height="3"
          viewBox="0 0 420 1"
          fill="none"
          style={{ position: "absolute", left: "0px", bottom: "10px" }}
        >
          <motion.path
            d="M-0.5 0.5H420.5"
            stroke="#E47F80"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            fill="none"
            transition={{
              duration: 5,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
              repeatDelay: 1,
            }}
            onUpdate={handleUpdateMainBranch}
          />
        </motion.svg>

        {/* Second branching */}
        <motion.svg
          width="208"
          height="27"
          viewBox="0 0 208 27"
          fill="none"
          strokeWidth="2"
          style={{ position: "absolute", left: "212px", bottom: "10px" }}
        >
          <motion.path
            d="M1 26.5L18.9991 2.96275C19.9451 1.72566 21.4135 1 22.9709 1H164H207.5"
            stroke="#E581CA"
            onUpdate={handleUpdateSecondBranch}
            animate={startFirstNode ? "show" : "hidden"}
            initial={"hidden"}
            variants={branchVariants}
            transition={{
              duration: 2.5,
              ease: "linear",
            }}
          />
        </motion.svg>

        {/* First node */}
        <motion.svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          style={{ position: "absolute", left: "209px", bottom: "7px" }}
          animate={startFirstNode ? "show" : "hidden"}
          initial={"hidden"}
          variants={nodeVariants}
        >
          <motion.circle
            cx="4"
            cy="4"
            r="3.5"
            fill="#fafafa"
            stroke="#E47F80"
          />
        </motion.svg>

        {/* Third branching */}
        <motion.svg
          width="112"
          height="22"
          viewBox="0 0 112 22"
          fill="none"
          strokeWidth="2"
          style={{ position: "absolute", left: "295px", bottom: "37px" }}
        >
          <motion.path
            animate={startSecondNode ? "show" : "hidden"}
            initial={"hidden"}
            variants={branchVariants}
            transition={{
              duration: 1.5,
              ease: "linear",
            }}
            d="M1 21.5L7.5 12.5L13.1129 4.43149C14.6084 2.28172 17.0613 1 19.6801 1H93.3199C95.9387 1 98.3916 2.28172 99.8871 4.43148L105.5 12.5L111.5 21.5"
            stroke="#B181E3"
            onUpdate={handleUpdateThirdBranch}
          />
        </motion.svg>

        {/* Second node */}
        <motion.svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          style={{ position: "absolute", left: "292px", bottom: "32px" }}
          variants={nodeVariants}
          animate={startSecondNode ? "show" : "hidden"}
          initial={"hidden"}
        >
          <motion.circle
            cx="4"
            cy="4"
            r="3.5"
            fill="#fafafa"
            stroke="#B181E3"
          />
        </motion.svg>

        {/* Third node */}
        <motion.svg
          width="8"
          height="8"
          viewBox="0 0 8 8"
          fill="none"
          style={{ position: "absolute", left: "401px", bottom: "32px" }}
          variants={nodeVariants}
          animate={startThirdNode ? "show" : "hidden"}
          initial={"hidden"}
        >
          <motion.circle
            cx="4"
            cy="4"
            r="3.5"
            fill="#fafafa"
            stroke="#B181E3"
          />
        </motion.svg>
      </>
    );
  }
}

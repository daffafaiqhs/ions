import { motion } from "framer-motion";

const LoadingDot = {
  display: "block",
  width: "2rem",
  height: "2rem",
  backgroundColor: "#8669FF",
  borderRadius: "50%",
};

const LoadingContainer = {
  width: "10rem",
  height: "10vh",
  display: "flex",
  justifyContent: "space-around",
};

const DotVariants = {
  animate: {
    y: ["0%", "100%", "0%"], // Explicit keyframes for looping
  },
};

const DotTransition = {
  duration: 1.5,
  repeat: Infinity, // Ensures infinite looping
  ease: "easeInOut",
};

export default function ThreeDotsWave() {
  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <motion.div style={LoadingContainer}>
        <motion.span
          style={LoadingDot}
          variants={DotVariants}
          animate="animate"
          transition={{ ...DotTransition, delay: 0 }} // Individual delay for each dot
        />
        <motion.span
          style={LoadingDot}
          variants={DotVariants}
          animate="animate"
          transition={{ ...DotTransition, delay: 0.2 }} // Stagger by adding delay
        />
        <motion.span
          style={LoadingDot}
          variants={DotVariants}
          animate="animate"
          transition={{ ...DotTransition, delay: 0.4 }}
        />
      </motion.div>
    </div>
  );
}

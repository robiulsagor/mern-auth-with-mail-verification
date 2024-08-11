/* eslint-disable react/prop-types */
import { motion } from "framer-motion";

function FloatingShape({ size, color, top, left, delay, duration }) {
  return (
    <motion.div
      className={`absolute rounded-full ${color} ${size} opacity blur-3xl `}
      style={{ top, left }}
      animate={{
        y: ["0%", "100%", "0%"],
        x: ["0%", "100%", "0%"],
        rotate: [0, 360],
      }}
      transition={{
        repeat: Infinity,
        ease: "linear",
        delay,
        duration,
      }}
    />
  );
}

export default FloatingShape;

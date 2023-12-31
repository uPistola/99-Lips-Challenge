import React, { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

const Reveal = ({ children, width = "fit-content" }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once : true });

  const mainControls = useAnimation();

useEffect(() => {
    if (isInView) {
      console.log("True");
      mainControls.start("visible");
    }
});

  return (
    <div ref={ref}>
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{duration:1, delay:0.45}}
      >
        {children}
      </motion.div>
    </div>
  );
};

export default Reveal;

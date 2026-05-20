import { motion } from "framer-motion";

export default function Reveal({ delay = 0, children, className, ...rest }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], delay }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
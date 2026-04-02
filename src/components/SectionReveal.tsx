import { motion } from "framer-motion";
import type { ReactNode } from "react";

const SectionReveal = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <motion.section
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    className={className}
  >
    {children}
  </motion.section>
);

export default SectionReveal;

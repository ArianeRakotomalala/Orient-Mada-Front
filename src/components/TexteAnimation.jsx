import { motion } from "framer-motion";

const TexteAnimation = ({texte}) => {
  return (
    <motion.div>
      {texte.split("").map((letter, index) => (
        <motion.span
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: index * 0.1 }}
          style={{
            fontSize: "2rem",
            
          }}
        >
            {letter}
        </motion.span>
      ))}
    </motion.div>
  );
};
export default TexteAnimation;


import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedList = ({ 
  children, 
  staggerDelay = 0.1,
  direction = 'up',
  sx = {},
  ...props 
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: 30 };
      case 'down':
        return { opacity: 0, y: -30 };
      case 'left':
        return { opacity: 0, x: -30 };
      case 'right':
        return { opacity: 0, x: 30 };
      default:
        return { opacity: 0, y: 30 };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: getInitialPosition(),
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.6,
        type: "spring",
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={sx}
      {...props}
    >
      {React.Children.map(children, (child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

export default AnimatedList; 
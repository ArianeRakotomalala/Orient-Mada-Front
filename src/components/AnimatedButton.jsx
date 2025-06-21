import React from 'react';
import { Button } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedButton = ({ 
  children, 
  variant = 'contained',
  color = 'primary',
  sx = {},
  delay = 0,
  ...props 
}) => {
  const baseSx = {
    borderRadius: 3,
    fontWeight: 600,
    textTransform: 'none',
    fontSize: '1rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: '-100%',
      width: '100%',
      height: '100%',
      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
      transition: 'left 0.5s'
    },
    '&:hover::before': {
      left: '100%'
    },
    ...sx
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay,
        type: "spring",
        stiffness: 200
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.95 }}
    >
      <Button
        variant={variant}
        color={color}
        sx={baseSx}
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
};

export default AnimatedButton; 
import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedIcon = ({ 
  icon: Icon, 
  color = '#667eea',
  size = 40,
  delay = 0,
  pulse = false,
  rotate = false,
  sx = {},
  ...props 
}) => {
  const baseSx = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    p: 2,
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${color}20, ${color}10)`,
    border: `2px solid ${color}30`,
    boxShadow: `0 8px 32px ${color}20`,
    ...sx
  };

  const iconSx = {
    fontSize: size,
    color: color,
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
  };

  return (
    <motion.div
      initial={{ scale: 0, rotate: rotate ? -180 : 0 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ 
        duration: 0.8, 
        delay,
        type: "spring",
        stiffness: 200
      }}
      whileHover={{ 
        scale: 1.1,
        rotate: rotate ? 5 : 0,
        transition: { duration: 0.2 }
      }}
      animate={pulse ? {
        scale: [1, 1.1, 1],
        transition: {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      } : {}}
    >
      <Box sx={baseSx} {...props}>
        <Icon sx={iconSx} />
      </Box>
    </motion.div>
  );
};

export default AnimatedIcon; 
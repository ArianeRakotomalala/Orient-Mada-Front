import React from 'react';
import { Card, CardContent } from '@mui/material';
import { motion } from 'framer-motion';

const AnimatedCard = ({ 
  children, 
  sx = {}, 
  hoverEffect = true, 
  delay = 0, 
  direction = 'up',
  ...props 
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { opacity: 0, y: 50 };
      case 'down':
        return { opacity: 0, y: -50 };
      case 'left':
        return { opacity: 0, x: -50 };
      case 'right':
        return { opacity: 0, x: 50 };
      default:
        return { opacity: 0, y: 50 };
    }
  };

  const baseSx = {
    borderRadius: 4,
    background: 'rgba(255,255,255,0.95)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255,255,255,0.2)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    overflow: 'hidden',
    position: 'relative',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: '4px',
      background: 'linear-gradient(90deg, #667eea, #764ba2)',
      zIndex: 1,
      transform: 'scaleX(0)',
      transition: 'transform 0.3s ease'
    },
    ...(hoverEffect && {
      '&:hover': {
        boxShadow: '0 0 50px rgba(102, 126, 234, 0.3), 0 12px 40px rgba(0,0,0,0.15)',
        transform: 'scale(1.02) translateY(-8px)',
        '&::before': {
          transform: 'scaleX(1)'
        }
      }
    }),
    ...sx
  };

  return (
    <motion.div
      initial={getInitialPosition()}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ 
        duration: 0.8, 
        delay,
        type: "spring",
        stiffness: 100
      }}
      whileHover={hoverEffect ? {
        scale: 1.02,
        y: -8,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={{ scale: 0.98 }}
    >
      <Card sx={baseSx} {...props}>
        <CardContent sx={{ p: 4, pt: 5 }}>
          {children}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AnimatedCard; 
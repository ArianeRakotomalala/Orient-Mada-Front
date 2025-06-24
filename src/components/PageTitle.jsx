import React from 'react';
import { Box, Typography, Fade, Zoom } from '@mui/material';
import { motion } from 'framer-motion';

const PageTitle = ({ title, subtitle, icon: Icon, color = '#667eea' }) => {
  const isGradient = color.startsWith('linear-gradient');

  return (
    <Box sx={{ 
      textAlign: 'center', 
      mb: 6, 
      px: 2,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background decorative elements */}
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '200px',
        height: '200px',
        background: `radial-gradient(circle, ${color}15 0%, transparent 70%)`,
        borderRadius: '50%',
        zIndex: -1,
        animation: 'pulse 3s ease-in-out infinite'
      }} />
      
      <Fade in timeout={800}>
        <Box>
          {/* Icon with animation */}
          {Icon && (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ 
                duration: 0.8, 
                type: "spring",
                stiffness: 200,
                delay: 0.2
              }}
            >
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                mb: 2 
              }}>
                <Box sx={{
                  p: 2,
                  borderRadius: '50%',
                  background: isGradient ? color : `linear-gradient(135deg, ${color}20, ${color}10)`,
                  border: isGradient ? undefined : `2px solid ${color}30`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: isGradient ? undefined : `0 8px 32px ${color}20`
                }}>
                  <Icon sx={{ 
                    fontSize: 40, 
                    color: isGradient ? '#fff' : color,
                    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                  }} />
                </Box>
              </Box>
            </motion.div>
          )}

          {/* Main title with animation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 0.8, 
              delay: 0.4,
              type: "spring",
              stiffness: 100
            }}
          >
            <Typography 
              variant="h2" 
              fontWeight={900} 
              sx={{ 
                mb: 2,
                fontSize: { xs: '1.75rem', md: '2.45rem' },
                letterSpacing: '-0.02em',
                position: 'relative',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: '-10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '120px',
                  height: '4px',
                  background: isGradient ? color : `linear-gradient(90deg, ${color}, ${color}80)`,
                  borderRadius: '2px',
                  animation: 'slideIn 1s ease-out 0.8s both'
                }
              }}
            >
              {title}
            </Typography>
          </motion.div>

          {/* Subtitle with animation */}
          {subtitle && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.6,
                type: "spring",
                stiffness: 100
              }}
            >
              <Typography 
                variant="body1" 
                sx={{ 
                  maxWidth: 900, 
                  mx: 'auto',
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  color: '#666666',
                  fontWeight: 500,
                  p: 3,
                  borderRadius: 2,
                  background: 'rgba(255,255,255,0.8)',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.05)'
                }}
              >
                {subtitle}
              </Typography>
            </motion.div>
          )}

          {/* Decorative elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: 1,
              type: "spring",
              stiffness: 200
            }}
          >
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 1,
              mt: 3
            }}>
              {[...Array(3)].map((_, index) => (
                <Box
                  key={index}
                  sx={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: color,
                    opacity: 0.6,
                    animation: `bounce 2s ease-in-out infinite ${index * 0.2}s`
                  }}
                />
              ))}
            </Box>
          </motion.div>
        </Box>
      </Fade>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
          50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.5; }
        }
        
        @keyframes slideIn {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: 120px;
            opacity: 1;
          }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
      `}</style>
    </Box>
  );
};

export default PageTitle; 
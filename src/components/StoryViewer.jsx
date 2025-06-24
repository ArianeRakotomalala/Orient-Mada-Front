import React, { useState, useEffect, useContext } from 'react';
import { Avatar, Dialog, LinearProgress, Typography, Box, Button, Skeleton } from '@mui/material';
import { Cancel } from '@mui/icons-material';
import { DataContext } from "../context/DataContext";

const stories = [
  {
    id: 1,
    image: 'https://i.pinimg.com/736x/24/30/f0/2430f0496b5753ce53e420bd9a3d0559.jpg',
    university: 'ONIFRA',
    avatar: '/user1.jpg'
  },
  {
    id: 2,
    image: 'https://i.pinimg.com/736x/37/80/30/378030139247373b23081d99e1d39ba0.jpg',
    university: 'ISPM',
    avatar: '/user2.jpg'
  },
   {
    id: 3,
    image: 'https://i.pinimg.com/736x/b3/f4/a1/b3f4a14022e177d9ae08ab8dce69a9e4.jpg',
    university: 'ITU',
    avatar: '/user2.jpg'
  },
  {
    id: 4,
    image: 'https://i.pinimg.com/736x/47/73/b9/4773b92dafb4982dccc2539ec9778539.jpg',
    university: 'UCM',
    avatar: '/user2.jpg'
  }
];

export default function StoryViewer() {
  const { loading } = useContext(DataContext);
  const [open, setOpen] = useState(false);
  const [currentStory, setCurrentStory] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (open) {
      const timer = setInterval(() => {
        setProgress((old) => {
          if (old >= 100) {
            handleClose();
            return 0;
          }
          return old + 5;
        });
      }, 200);
      return () => clearInterval(timer);
    }
  }, [open]);

  const handleOpen = (story) => {
    setCurrentStory(story);
    setProgress(0);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentStory(null);
  };

  // Skeleton component for loading state
  const StoryViewerSkeleton = () => (
    <>
      <Skeleton variant="text" width="30%" height={32} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 2 }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Box key={index} sx={{ position: 'relative' }}>
            <Skeleton 
              variant="rounded" 
              width={120} 
              height={150} 
              sx={{ borderRadius: 2 }}
            />
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                p: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              <Skeleton variant="circular" width={24} height={24} />
              <Skeleton variant="text" width={40} height={16} />
            </Box>
          </Box>
        ))}
      </Box>
    </>
  );

  return (
    <>
      {loading ? (
        <StoryViewerSkeleton />
      ) : (
        <>
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                  Stories
          </Typography>   
          <Box sx={{ display: 'flex', gap: 2, }}>
              
                {stories.map((story) => (
                <Box
                    key={story.id}
                    onClick={() => handleOpen(story)}
                    sx={{
                        height: 150,
                        width: 120,
                        backgroundSize: 'cover',
                        backgroundImage: `url(${story.image})`,
                        borderRadius: 2,
                        backgroundPosition: 'center',
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: 3,
                    }}
                >
                    <Box
                        sx={{
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                            bgcolor: 'rgba(255, 255, 255, 0.2)',
                            color: 'white',
                            p: 1,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                        }}
                    >
                        <Avatar src={story.avatar} sx={{ width: 24, height: 24 }} />
                        <Typography variant="caption">{story.university}</Typography>
                    </Box>
                 </Box>
                ))}
             </Box>
        </>
      )}

      <Dialog  open={open} onClose={handleClose}>
        
        {currentStory && (
          <Box sx={{ height: '100%', position: 'relative' }}>
            <LinearProgress variant="determinate" value={progress} />
            <Button onClick={handleClose} > <Cancel/> </Button>
            <img
              src={currentStory.image}
              alt="story"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                bgcolor: 'rgba(0,0,0,0.5)',
                color: 'white',
                p: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              <Avatar src={currentStory.avatar} />
              <Typography variant="body1">{currentStory.university}</Typography>
            </Box>
          </Box>
        )}
      </Dialog>
    </>
  );
}

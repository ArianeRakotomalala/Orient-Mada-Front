import PostCard from "./PostCard";
import { Box, Grid, Typography } from "@mui/material";

function Feed() {
  const posts = [
    {
      title: "Post Title",
      description: `Located in California’s Silicon Valley, Stanford University is
      a world-renowned institution known for innovation, cutting-edge research,
      and strong ties to the tech industry. It fosters creativity and leadership
      across a wide range of disciplines.`,
      date: "2023-10-01",
      ville: "California Silicon Valley",
      srcimage: "https://i.pinimg.com/736x/59/c1/a8/59c1a82befad6fcf58b37b66c101282c.jpg",
      university: "Stanford University"
    },
    {
      title: "Another Post Title",
      description: `Based in Cambridge, Massachusetts, Harvard University is the oldest
      and one of the most prestigious universities in the world. It is celebrated
      for academic excellence, influential alumni, and a tradition of shaping global leaders.`,
      ville: "Cambridge Massachusetts",
      srcimage: "https://i.pinimg.com/736x/00/23/4c/00234cd973bee25ebe2812566a75057b.jpg",
      university: "Harvard University"
    }
  ];

  return (
    <>
        <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 3, mx: 6}}>
            Feed     
        </Typography>
            <div style={{ overflowY: "auto" }}>
                {posts.map((post, index) => ( 
                <PostCard
                    key={index}
                    title={post.title}
                    description={post.description}
                    date={post.date}
                    ville={post.ville}
                    srcimage={post.srcimage}
                    university={post.university}
                />
            ))}
            </div>
    </>
  );
}

export default Feed;

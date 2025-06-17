import { useContext, useEffect, useState } from "react";
import { DataContext } from "../Context/DataContext";
import PostCard from "./PostCard";
import { Typography } from "@mui/material";

function Feed() {
  const { institutions, loading } = useContext(DataContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // institutions peut être un objet avec .member ou un tableau direct
    const instList = Array.isArray(institutions?.member)
      ? institutions.member
      : Array.isArray(institutions)
      ? institutions
      : [];

    const transformed = instList.map((inst) => ({
      id: inst.id,
      title: inst.institution_name,
      description: inst.history || "Pas de description fournie.",
      ville: inst.location || "Ville inconnue",
      region: inst.region || "Région inconnue",
      srcimage:
        "https://i.pinimg.com/736x/0f/41/48/0f41481afda9b19fb8b9ba68bcb38b07.jpg",
      university: inst.institution_name,
    }));
    setPosts(transformed);
  }, [institutions]);

  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: "bold", mt: 3, mx: 6 }}>
        Feed
      </Typography>
      <div style={{ overflowY: "auto" }}>
        {loading && posts.length === 0 ? (
          Array.from({ length: 3 }).map((_, idx) => (
            <PostCard key={idx} loading={true} />
          ))
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              id={post.id}
              title={post.title}
              description={post.description}
              ville={post.ville}
              srcimage={post.srcimage}
              university={post.university}
            />
          ))
        )}
      </div>
    </>
  );
}

export default Feed;

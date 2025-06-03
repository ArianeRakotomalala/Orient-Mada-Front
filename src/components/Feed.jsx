import { useEffect, useState } from "react";
import PostCard from "./PostCard";
import { Typography } from "@mui/material";

function Feed() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
  fetch("/api/institutions")
    .then((res) => res.json())
    .then((data) => {
      console.log("Réponse de l'API institutions :", data);
      const institutions = data.member || [];

      const transformed = institutions.map((inst) => ({
        id: inst.id,
        title: inst.institution_name,
        description: inst.history || "Pas de description fournie.",
        ville: inst.location || "Ville inconnue",
        region: inst.region || "Région inconnue",
        srcimage: `https://i.pinimg.com/736x/0f/41/48/0f41481afda9b19fb8b9ba68bcb38b07.jpg`,
        university: inst.institution_name,
      }));

      setPosts(transformed);
    })
    .catch((err) =>
      console.error("Erreur lors du fetch des institutions :", err)
    );
}, []);

  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: "bold", mt: 3, mx: 6 }}>
        Feed
      </Typography>
      <div style={{ overflowY: "auto" }}>
        {posts.map((post) => (
          <PostCard
            key={post.id}
            id={post.id}
            title={post.title}
            description={post.description}
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

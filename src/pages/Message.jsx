import React, { useState, useContext } from "react";
import { Box, Typography, TextField, Button, Paper, List, ListItem, ListItemText, Avatar } from "@mui/material";
import { DataContext } from "../context/DataContext";
import TexteAnimation from "../components/TexteAnimation";

const Message = () => {
  const { institutions } = useContext(DataContext);
  const [messages, setMessages] = useState([
    { id: 1, sender: "Admin", text: "Bienvenue sur la messagerie !" }
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim() === "") return;
    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        sender: "Vous",
        text: input
      }
    ]);
    setInput("");
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 6 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Box sx={{ mb: 3, textAlign: "center" }}>
          <TexteAnimation texte="Messagerie" />
          <Typography variant="subtitle1" color="text.secondary">
            Discutez avec l'équipe ou d'autres utilisateurs.
          </Typography>
        </Box>
        <List sx={{ maxHeight: 300, overflowY: "auto", mb: 2 }}>
          {messages.map((msg) => (
            <ListItem key={msg.id} alignItems="flex-start">
              <Avatar sx={{ mr: 2 }}>{msg.sender[0]}</Avatar>
              <ListItemText
                primary={
                  <Typography fontWeight={600}>{msg.sender}</Typography>
                }
                secondary={msg.text}
              />
            </ListItem>
          ))}
        </List>
        <Box sx={{ display: "flex", gap: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Écrivez un message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <Button variant="contained" color="primary" onClick={handleSend}>
            Envoyer
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Message;
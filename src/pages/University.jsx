import { useState, useEffect } from "react";
import axios from "axios";
import SchoolIcon from '@mui/icons-material/School';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
  InputBase,
  Menu,
  MenuItem
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import Avatar from '@mui/material/Avatar';
function University() {
  const [universities, setUniversities] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sortBy, setSortBy] = useState("Nom");
  const [search, setSearch] = useState("");

  const handleSortClick = (event) => setAnchorEl(event.currentTarget);
  const handleSortClose = (value) => {
    if (value) setSortBy(value);
    setAnchorEl(null);
  };

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await axios.get("/api/institutions");
        const data = response.data.member || [];
        setUniversities(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erreur lors du chargement des universités :", error);
        setUniversities([]);
      }
    };
    fetchUniversities();
  }, []);

  // Filtrage et tri
  const filtered = universities
    .filter((u) =>
      (u.institution_name || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.localisation || "").toLowerCase().includes(search.toLowerCase()) ||
      (u.region || "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "Nom") return (a.institution_name || "").localeCompare(b.institution_name || "");
      if (sortBy === "Type") return (a.type || "").localeCompare(b.type || "");
      if (sortBy === "Localisation") return (a.localisation || "").localeCompare(b.localisation || "");
      if (sortBy === "Région") return (a.region || "").localeCompare(b.region || "");
      return 0;
    });

  return (
    <Box
      sx={{
        maxWidth: "95%",
        margin: "0px auto",
        padding: 5,
        background: "white",
        // borderRadius: 3,
        // boxShadow: 1,
      }}
    >
      <Typography variant="h4" fontWeight={700} mb={3} color="primary" textAlign="center">
        Liste des Universités
      </Typography>
      {/* Barre de recherche et tri */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, gap: 2, flexWrap: "wrap" }}>
        <Box sx={{ display: "flex", alignItems: "center", background: "#fff", borderRadius: 2, px: 2, boxShadow: 1 }}>
          <SearchIcon color="action" />
          <InputBase
            placeholder="Rechercher…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ ml: 1, flex: 1 }}
          />
        </Box>
        <Box>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSortClick}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            Trier par : {sortBy}
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => handleSortClose()}>
            <MenuItem onClick={() => handleSortClose("Nom")}>Nom</MenuItem>
            <MenuItem onClick={() => handleSortClose("Type")}>Type</MenuItem>
            <MenuItem onClick={() => handleSortClose("Localisation")}>Localisation</MenuItem>
            <MenuItem onClick={() => handleSortClose("Région")}>Région</MenuItem>
          </Menu>
        </Box>
      </Box>
      <TableContainer
        component={Paper}
        sx={{
          maxHeight: 420,
          borderRadius: 2,
          background: "#fff",
          overflowY: "auto",
        }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell><b>Nom de l'institution</b></TableCell>
              <TableCell><b>Type</b></TableCell>
              <TableCell><b>Localisation</b></TableCell>
              <TableCell><b>Région</b></TableCell>
              <TableCell align="center"><b>Action</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((uni) => (
              <TableRow
                key={uni.id}
                hover
                sx={{
                  "&:hover": { background: "#e3f2fd" },
                }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Avatar
                      src={uni.photo || ""}
                      alt={uni.institution_name}
                      sx={{ bgcolor: "#1976d2", width: 36, height: 36 }}
                    >
                      {!uni.photo && <SchoolIcon />}
                    </Avatar>
                    <Typography fontWeight={600} color="primary">
                      {uni.institution_name}
                    </Typography>
                  </Box>
                </TableCell>

                <TableCell>
                  <Chip label={uni.type} color={uni.type === "Publique" ? "success" : "secondary"} size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={uni.location || "-"} color="info" size="small" />
                </TableCell>
                <TableCell>
                  <Chip label={uni.region || "-"} color="default" size="small" />
                </TableCell>
                <TableCell align="center">
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => alert(`Détail de ${uni.institution_name}`)}
                  >
                    Voir le détail
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default University;
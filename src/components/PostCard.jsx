import { 
  Box, 
  Grid, 
  Typography, 
  Card, 
  CardHeader, 
  CardMedia, 
  CardContent, 
  CardActions, 
  Collapse, 
  Avatar, 
  IconButton 
} from "@mui/material";
import { pink, red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Bouton from "./Bouton";
import { Unarchive } from "@mui/icons-material";
import Button from "@mui/material/Button";
import SchoolIcon from '@mui/icons-material/School';
// import Bouton from './Bouton'
import { pipe } from "framer-motion";

function PostCard({ title, description, ville, srcimage, university }) { 
    return(
        <Card sx={{ maxWidth: 600, margin: '20px auto',borderRadius: '10px' }} minheight="100%">
          <CardHeader
            sx={{ }}
            avatar={
                <Avatar sx={{ bgcolor: red[900], color:'white' }} aria-label="university">
                    {university && university.charAt(0).toUpperCase()}
                </Avatar>
            }
            action={
                <IconButton aria-label="settings">
                    <MoreVertIcon />
                </IconButton>
            }
            title={university}
            subheader={ville}
            />
            <CardMedia
                component="img"
                height="194"
                image={srcimage}
                alt={university}
            />
            <CardContent>
                <Typography variant="body2" sx={{ textAlign: 'justify' }}>
                    {description}
                </Typography>
            </CardContent>
            <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                    <ShareIcon />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    variant="contained"
                    startIcon={<SchoolIcon />}
                    sx={{
                        // background: "linear-gradient(90deg,rgb(129, 129, 129) 0%,rgb(255, 255, 255) 100%)",
                        backgroundColor:'white',
                        color: "black",
                        borderRadius: "30px",
                        textTransform: "none",
                        fontWeight: "bold",
                        px: 3,
                        py: 1,
                        boxShadow: 1,
                        '&:hover': {
                            background: 'linear-gradient(90deg, #B67878 0%,rgb(214, 168, 198) 100%)',
                            color: 'white',
                        },
                    }}
                >
                    Voir l'université
                </Button>
            </CardActions>
        </Card>
    );
 }
export default PostCard;
import Button from '@mui/material/Button'; // 👈 j'importe le composant Button de MUI
import Try from '../components/try';
import EmailIcon from '@mui/icons-material/Email'; // 👈 j'importe l'icône Email de MUI
function Home() {
  return (
    <div>
      <h1>Bienvenue dans mon app React + MUI</h1>
      <Button variant="outlined" color="secondary">
        Clique ici
      </Button>
      <Try label="Email" icone={<EmailIcon />} />
    </div>
  )
}

export default Home;
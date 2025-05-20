import Button from '@mui/material/Button'; // 👈 j'importe le composant Button de MUI

function Home() {
  return (
    <div>
      <h1>Bienvenue dans mon app React + MUI</h1>
      <Button variant="outlined" color="secondary">
        Clique ici
      </Button>
    </div>
  )
}

export default Home;
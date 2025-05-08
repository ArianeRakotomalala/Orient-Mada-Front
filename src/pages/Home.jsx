import Welcome from '../components/Welcome'; // 👈 j'importe le composant Welcome

function Home() {
  return (
    <div>
      <h2>Page d'accueil</h2>
      <Welcome />
    </div>
  );
}

export default Home;
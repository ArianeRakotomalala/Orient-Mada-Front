// Questions et réponses pour le test d'orientation
const questions = [
  {
    id: 'q1',
    label: "Quel type d'activité préférez-vous ?",
    options: [
      { label: "Résoudre des problèmes techniques ou scientifiques", domaineKey: "sciences", domaine: "Sciences & Technologies" },
      { label: "Soigner, aider ou accompagner les personnes", domaineKey: "sante", domaine: "Santé & Social" },
      { label: "Étudier la société, l'histoire ou les langues", domaineKey: "lettres", domaine: "Lettres & Sciences Humaines" },
      { label: "Organiser, gérer, vendre ou administrer", domaineKey: "eco", domaine: "Économie & Gestion" },
      { label: "Créer des œuvres artistiques ou visuelles", domaineKey: "arts", domaine: "Arts & Design" },
      { label: "Travailler en lien avec la nature, l'agriculture ou l'environnement", domaineKey: "agri", domaine: "Agriculture & Environnement" },
    ],
  },
  {
    id: 'q2',
    label: "Quelle matière à l'école vous passionne le plus ?",
    options: [
      { label: "Mathématiques, Physique, Chimie", domaineKey: "sciences", domaine: "Sciences & Technologies" },
      { label: "Biologie, Sciences de la santé", domaineKey: "sante", domaine: "Santé & Social" },
      { label: "Histoire, Philosophie, Littérature", domaineKey: "lettres", domaine: "Lettres & Sciences Humaines" },
      { label: "Économie, Gestion, Droit", domaineKey: "eco", domaine: "Économie & Gestion" },
      { label: "Arts plastiques, Musique", domaineKey: "arts", domaine: "Arts & Design" },
      { label: "Sciences de la terre, Agronomie", domaineKey: "agri", domaine: "Agriculture & Environnement" },
    ],
  },
  {
    id: 'q3',
    label: "Dans quel type d'environnement de travail vous voyez-vous ?",
    options: [
      { label: "Laboratoire, entreprise technologique", domaineKey: "sciences", domaine: "Sciences & Technologies" },
      { label: "Hôpital, centre social, école", domaineKey: "sante", domaine: "Santé & Social" },
      { label: "Bibliothèque, journal, ONG", domaineKey: "lettres", domaine: "Lettres & Sciences Humaines" },
      { label: "Bureau, entreprise commerciale", domaineKey: "eco", domaine: "Économie & Gestion" },
      { label: "Atelier, scène, studio créatif", domaineKey: "arts", domaine: "Arts & Design" },
      { label: "Ferme, parc naturel, laboratoire environnemental", domaineKey: "agri", domaine: "Agriculture & Environnement" },
    ],
  },
  {
    id: 'q4',
    label: "Quel est votre objectif principal dans un métier ?",
    options: [
      { label: "Innover, chercher, créer des solutions techniques", domaineKey: "sciences", domaine: "Sciences & Technologies" },
      { label: "Soigner, soutenir, éduquer les autres", domaineKey: "sante", domaine: "Santé & Social" },
      { label: "Comprendre et expliquer les phénomènes sociaux et culturels", domaineKey: "lettres", domaine: "Lettres & Sciences Humaines" },
      { label: "Diriger, organiser, développer une entreprise", domaineKey: "eco", domaine: "Économie & Gestion" },
      { label: "Exprimer votre créativité et vos talents artistiques", domaineKey: "arts", domaine: "Arts & Design" },
      { label: "Préserver la nature et gérer les ressources durables", domaineKey: "agri", domaine: "Agriculture & Environnement" },
    ],
  },
  {
    id: 'q5',
    label: "Quel style de travail préférez-vous ?",
    options: [
      { label: "Travail rigoureux et méthodique seul ou en équipe", domaineKey: "sciences", domaine: "Sciences & Technologies" },
      { label: "Travail humain, relationnel, avec beaucoup d'interactions", domaineKey: "sante", domaine: "Santé & Social" },
      { label: "Analyse, réflexion, rédaction", domaineKey: "lettres", domaine: "Lettres & Sciences Humaines" },
      { label: "Travail dynamique, gestion de projet, prise de décisions", domaineKey: "eco", domaine: "Économie & Gestion" },
      { label: "Travail manuel, création, performances", domaineKey: "arts", domaine: "Arts & Design" },
      { label: "Travail en extérieur, terrain, observations", domaineKey: "agri", domaine: "Agriculture & Environnement" },
    ],
  },
  {
    id: 'q6',
    label: "Quelle phrase vous décrit le mieux ?",
    options: [
      { label: "J'aime comprendre comment fonctionnent les choses", domaineKey: "sciences", domaine: "Sciences & Technologies" },
      { label: "J'aime écouter et aider les autres", domaineKey: "sante", domaine: "Santé & Social" },
      { label: "J'aime débattre, apprendre sur les cultures et les lois", domaineKey: "lettres", domaine: "Lettres & Sciences Humaines" },
      { label: "J'aime organiser et diriger des équipes", domaineKey: "eco", domaine: "Économie & Gestion" },
      { label: "J'aime créer des œuvres uniques et originales", domaineKey: "arts", domaine: "Arts & Design" },
      { label: "J'aime protéger l'environnement et travailler la terre", domaineKey: "agri", domaine: "Agriculture & Environnement" },
    ],
  },
  {
    id: 'q7',
    label: "Quelle activité vous attire le plus ?",
    options: [
      { label: "Programmer, expérimenter, analyser des données", domaineKey: "sciences", domaine: "Sciences & Technologies" },
      { label: "Soigner des malades, enseigner, conseiller", domaineKey: "sante", domaine: "Santé & Social" },
      { label: "Écrire, communiquer, faire du journalisme", domaineKey: "lettres", domaine: "Lettres & Sciences Humaines" },
      { label: "Gérer un projet, lancer une entreprise", domaineKey: "eco", domaine: "Économie & Gestion" },
      { label: "Peindre, jouer de la musique, danser", domaineKey: "arts", domaine: "Arts & Design" },
      { label: "Cultiver, étudier la faune et la flore", domaineKey: "agri", domaine: "Agriculture & Environnement" },
    ],
  },
  {
    id: 'q8',
    label: "Comment préférez-vous apprendre ?",
    options: [
      { label: "Par des expériences pratiques et théoriques en sciences", domaineKey: "sciences", domaine: "Sciences & Technologies" },
      { label: "Par des échanges humains et cas concrets", domaineKey: "sante", domaine: "Santé & Social" },
      { label: "Par la lecture, la recherche et la réflexion critique", domaineKey: "lettres", domaine: "Lettres & Sciences Humaines" },
      { label: "Par la gestion de situations réelles et responsabilités", domaineKey: "eco", domaine: "Économie & Gestion" },
      { label: "Par la pratique artistique et les ateliers", domaineKey: "arts", domaine: "Arts & Design" },
      { label: "Par le terrain, la nature et l'observation directe", domaineKey: "agri", domaine: "Agriculture & Environnement" },
    ],
  },
  {
    id: 'q9',
    label: "Face à un problème, vous…",
    options: [
      { label: "Cherche la solution scientifique ou technique", domaineKey: "sciences", domaine: "Sciences & Technologies" },
      { label: "Cherche à comprendre l'impact humain et social", domaineKey: "sante", domaine: "Santé & Social" },
      { label: "Cherche des précédents historiques ou juridiques", domaineKey: "lettres", domaine: "Lettres & Sciences Humaines" },
      { label: "Cherche à organiser les ressources pour résoudre", domaineKey: "eco", domaine: "Économie & Gestion" },
      { label: "Cherche une solution créative, innovante", domaineKey: "arts", domaine: "Arts & Design" },
      { label: "Cherche une solution durable respectant la nature", domaineKey: "agri", domaine: "Agriculture & Environnement" },
    ],
  },
  {
    id: 'q10',
    label: "Quelle carrière vous fait rêver ?",
    options: [
      { label: "Ingénieur, chercheur, informaticien", domaineKey: "sciences", domaine: "Sciences & Technologies" },
      { label: "Médecin, infirmier, éducateur social", domaineKey: "sante", domaine: "Santé & Social" },
      { label: "Avocat, journaliste, historien", domaineKey: "lettres", domaine: "Lettres & Sciences Humaines" },
      { label: "Chef d'entreprise, manager, économiste", domaineKey: "eco", domaine: "Économie & Gestion" },
      { label: "Artiste, architecte, musicien", domaineKey: "arts", domaine: "Arts & Design" },
      { label: "Agronome, écologiste, garde forestier", domaineKey: "agri", domaine: "Agriculture & Environnement" },
    ],
  },
];

export default questions; 
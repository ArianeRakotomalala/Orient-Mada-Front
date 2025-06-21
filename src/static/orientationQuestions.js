// Questions et réponses pour le test d'orientation
const questions = [
  {
    id: 'q1',
    label: "Aimez-vous travailler avec des langues étrangères ?",
    options: [
      { label: "Oui, j'adore apprendre et pratiquer les langues", domaineKey: "lettres", domaine: "Lettres, Langues et Sciences Humaines" },
      { label: "Non, je préfère d'autres domaines", domaineKey: "autres", domaine: "Autres domaines" },
    ],
  },
  {
    id: 'q2',
    label: "Quel type d'activité vous attire le plus ?",
    options: [
      { label: "Programmer et créer des applications", domaineKey: "sciences", domaine: "Sciences et Technologies" },
      { label: "Soigner et aider les autres", domaineKey: "sante", domaine: "Santé et Médecine" },
      { label: "Analyser les comportements humains", domaineKey: "social", domaine: "Sciences Sociales et Droit" },
      { label: "Concevoir et construire des structures", domaineKey: "ingenierie", domaine: "Ingénierie et Techniques" },
      { label: "Travailler avec la nature et l'environnement", domaineKey: "agronomie", domaine: "Agronomie, Environnement et Développement Durable" },
      { label: "Accueillir et faire découvrir", domaineKey: "tourisme", domaine: "Tourisme et Autres" },
    ],
  },
  {
    id: 'q3',
    label: "Dans quel environnement préférez-vous travailler ?",
    options: [
      { label: "Laboratoire ou bureau technique", domaineKey: "sciences", domaine: "Sciences et Technologies" },
      { label: "Hôpital ou centre médical", domaineKey: "sante", domaine: "Santé et Médecine" },
      { label: "Bureau ou salle de réunion", domaineKey: "social", domaine: "Sciences Sociales et Droit" },
      { label: "Chantier ou atelier", domaineKey: "ingenierie", domaine: "Ingénierie et Techniques" },
      { label: "Extérieur ou ferme", domaineKey: "agronomie", domaine: "Agronomie, Environnement et Développement Durable" },
      { label: "Hôtel ou site touristique", domaineKey: "tourisme", domaine: "Tourisme et Autres" },
    ],
  },
  {
    id: 'q4',
    label: "Quelle matière scolaire vous passionne le plus ?",
    options: [
      { label: "Mathématiques et Physique", domaineKey: "sciences", domaine: "Sciences et Technologies" },
      { label: "Biologie et Sciences de la vie", domaineKey: "sante", domaine: "Santé et Médecine" },
      { label: "Histoire et Géographie", domaineKey: "lettres", domaine: "Lettres, Langues et Sciences Humaines" },
      { label: "Économie et Gestion", domaineKey: "social", domaine: "Sciences Sociales et Droit" },
      { label: "Technologie et Dessin technique", domaineKey: "ingenierie", domaine: "Ingénierie et Techniques" },
      { label: "Sciences de la terre", domaineKey: "agronomie", domaine: "Agronomie, Environnement et Développement Durable" },
    ],
  },
  {
    id: 'q5',
    label: "Quel est votre objectif principal dans un métier ?",
    options: [
      { label: "Innover et créer des solutions techniques", domaineKey: "sciences", domaine: "Sciences et Technologies" },
      { label: "Soigner et améliorer la santé", domaineKey: "sante", domaine: "Santé et Médecine" },
      { label: "Comprendre et expliquer la société", domaineKey: "social", domaine: "Sciences Sociales et Droit" },
      { label: "Concevoir et construire", domaineKey: "ingenierie", domaine: "Ingénierie et Techniques" },
      { label: "Préserver l'environnement", domaineKey: "agronomie", domaine: "Agronomie, Environnement et Développement Durable" },
      { label: "Faire découvrir et accueillir", domaineKey: "tourisme", domaine: "Tourisme et Autres" },
    ],
  },
  {
    id: 'q6',
    label: "Quel type de problème aimez-vous résoudre ?",
    options: [
      { label: "Problèmes techniques et scientifiques", domaineKey: "sciences", domaine: "Sciences et Technologies" },
      { label: "Problèmes de santé et bien-être", domaineKey: "sante", domaine: "Santé et Médecine" },
      { label: "Problèmes sociaux et humains", domaineKey: "social", domaine: "Sciences Sociales et Droit" },
      { label: "Problèmes de construction et design", domaineKey: "ingenierie", domaine: "Ingénierie et Techniques" },
      { label: "Problèmes environnementaux", domaineKey: "agronomie", domaine: "Agronomie, Environnement et Développement Durable" },
      { label: "Problèmes d'organisation et d'accueil", domaineKey: "tourisme", domaine: "Tourisme et Autres" },
    ],
  },
  {
    id: 'q7',
    label: "Aimez-vous les mathématiques et la physique ?",
    options: [
      { label: "Oui, les sciences exactes me passionnent", domaineKey: "sciences", domaine: "Sciences et Technologies" },
      { label: "Non, je préfère d'autres matières", domaineKey: "autres", domaine: "Autres domaines" },
    ],
  },
  {
    id: 'q8',
    label: "Quel style de travail préférez-vous ?",
    options: [
      { label: "Travail méthodique et analytique", domaineKey: "sciences", domaine: "Sciences et Technologies" },
      { label: "Travail relationnel et humain", domaineKey: "sante", domaine: "Santé et Médecine" },
      { label: "Travail de recherche et d'analyse", domaineKey: "social", domaine: "Sciences Sociales et Droit" },
      { label: "Travail manuel et technique", domaineKey: "ingenierie", domaine: "Ingénierie et Techniques" },
      { label: "Travail en extérieur et terrain", domaineKey: "agronomie", domaine: "Agronomie, Environnement et Développement Durable" },
      { label: "Travail d'équipe et service", domaineKey: "tourisme", domaine: "Tourisme et Autres" },
    ],
  },
  {
    id: 'q9',
    label: "Quelle activité vous attire le plus ?",
    options: [
      { label: "Expérimenter en laboratoire", domaineKey: "sciences", domaine: "Sciences et Technologies" },
      { label: "Soigner des personnes", domaineKey: "sante", domaine: "Santé et Médecine" },
      { label: "Écrire et communiquer", domaineKey: "lettres", domaine: "Lettres, Langues et Sciences Humaines" },
      { label: "Gérer des projets", domaineKey: "social", domaine: "Sciences Sociales et Droit" },
      { label: "Dessiner des plans", domaineKey: "ingenierie", domaine: "Ingénierie et Techniques" },
      { label: "Observer la nature", domaineKey: "agronomie", domaine: "Agronomie, Environnement et Développement Durable" },
    ],
  },
  {
    id: 'q10',
    label: "Quel type de lecture préférez-vous ?",
    options: [
      { label: "Livres scientifiques et techniques", domaineKey: "sciences", domaine: "Sciences et Technologies" },
      { label: "Livres de médecine et santé", domaineKey: "sante", domaine: "Santé et Médecine" },
      { label: "Romans et littérature", domaineKey: "lettres", domaine: "Lettres, Langues et Sciences Humaines" },
      { label: "Livres d'économie et société", domaineKey: "social", domaine: "Sciences Sociales et Droit" },
      { label: "Manuels techniques", domaineKey: "ingenierie", domaine: "Ingénierie et Techniques" },
      { label: "Livres sur la nature", domaineKey: "agronomie", domaine: "Agronomie, Environnement et Développement Durable" },
    ],
  },
  {
    id: 'q11',
    label: "Aimez-vous la biologie et les sciences de la vie ?",
    options: [
      { label: "Oui, étudier le vivant me passionne", domaineKey: "sciences", domaine: "Sciences et Technologies" },
      { label: "Non, je préfère d'autres sciences", domaineKey: "autres", domaine: "Autres domaines" },
    ],
  },
  {
    id: 'q12',
    label: "Quel type de projet vous motiverait le plus ?",
    options: [
      { label: "Créer une application informatique", domaineKey: "sciences", domaine: "Sciences et Technologies" },
      { label: "Améliorer la santé publique", domaineKey: "sante", domaine: "Santé et Médecine" },
      { label: "Écrire un livre ou un article", domaineKey: "lettres", domaine: "Lettres, Langues et Sciences Humaines" },
      { label: "Lancer une entreprise", domaineKey: "social", domaine: "Sciences Sociales et Droit" },
      { label: "Concevoir un bâtiment", domaineKey: "ingenierie", domaine: "Ingénierie et Techniques" },
      { label: "Protéger l'environnement", domaineKey: "agronomie", domaine: "Agronomie, Environnement et Développement Durable" },
    ],
  },
  {
    id: 'q13',
    label: "Quel type de personne vous admirez le plus ?",
    options: [
      { label: "Un scientifique ou inventeur", domaineKey: "sciences", domaine: "Sciences et Technologies" },
      { label: "Un médecin ou soignant", domaineKey: "sante", domaine: "Santé et Médecine" },
      { label: "Un écrivain ou philosophe", domaineKey: "lettres", domaine: "Lettres, Langues et Sciences Humaines" },
      { label: "Un entrepreneur ou leader", domaineKey: "social", domaine: "Sciences Sociales et Droit" },
      { label: "Un architecte ou ingénieur", domaineKey: "ingenierie", domaine: "Ingénierie et Techniques" },
      { label: "Un écologiste ou agriculteur", domaineKey: "agronomie", domaine: "Agronomie, Environnement et Développement Durable" },
    ],
  },
  {
    id: 'q14',
    label: "Souhaitez-vous travailler avec des machines et des systèmes ?",
    options: [
      { label: "Oui, la mécanique et l'électricité m'intéressent", domaineKey: "ingenierie", domaine: "Ingénierie et Techniques" },
      { label: "Non, je préfère d'autres domaines", domaineKey: "autres", domaine: "Autres domaines" },
    ],
  },
  {
    id: 'q15',
    label: "Quel type de voyage vous attire le plus ?",
    options: [
      { label: "Visiter des centres de recherche", domaineKey: "sciences", domaine: "Sciences et Technologies" },
      { label: "Découvrir des cultures différentes", domaineKey: "lettres", domaine: "Lettres, Langues et Sciences Humaines" },
      { label: "Explorer des villes et monuments", domaineKey: "ingenierie", domaine: "Ingénierie et Techniques" },
      { label: "Découvrir la nature sauvage", domaineKey: "agronomie", domaine: "Agronomie, Environnement et Développement Durable" },
      { label: "Visiter des sites touristiques", domaineKey: "tourisme", domaine: "Tourisme et Autres" },
      { label: "Rencontrer des communautés locales", domaineKey: "social", domaine: "Sciences Sociales et Droit" },
    ],
  },
  {
    id: 'q16',
    label: "Aimez-vous la chimie et les expériences en laboratoire ?",
    options: [
      { label: "Oui, manipuler des produits chimiques m'attire", domaineKey: "sciences", domaine: "Sciences et Technologies" },
      { label: "Non, je préfère d'autres approches", domaineKey: "autres", domaine: "Autres domaines" },
    ],
  },
  {
    id: 'q17',
    label: "Quel type de film préférez-vous ?",
    options: [
      { label: "Films scientifiques ou technologiques", domaineKey: "sciences", domaine: "Sciences et Technologies" },
      { label: "Films historiques ou culturels", domaineKey: "lettres", domaine: "Lettres, Langues et Sciences Humaines" },
      { label: "Films sur la société et les relations", domaineKey: "social", domaine: "Sciences Sociales et Droit" },
      { label: "Films d'action et d'aventure", domaineKey: "ingenierie", domaine: "Ingénierie et Techniques" },
      { label: "Films sur la nature et l'environnement", domaineKey: "agronomie", domaine: "Agronomie, Environnement et Développement Durable" },
      { label: "Films de voyage et découverte", domaineKey: "tourisme", domaine: "Tourisme et Autres" },
    ],
  },
  {
    id: 'q18',
    label: "Êtes-vous passionné par les télécommunications ?",
    options: [
      { label: "Oui, les réseaux et la communication m'attirent", domaineKey: "sciences", domaine: "Sciences et Technologies" },
      { label: "Non, ce n'est pas mon domaine", domaineKey: "autres", domaine: "Autres domaines" },
    ],
  },
  {
    id: 'q19',
    label: "Quel type de jeu préférez-vous ?",
    options: [
      { label: "Jeux de logique et puzzle", domaineKey: "sciences", domaine: "Sciences et Technologies" },
      { label: "Jeux de rôle et simulation", domaineKey: "social", domaine: "Sciences Sociales et Droit" },
      { label: "Jeux de construction", domaineKey: "ingenierie", domaine: "Ingénierie et Techniques" },
      { label: "Jeux d'exploration", domaineKey: "agronomie", domaine: "Agronomie, Environnement et Développement Durable" },
      { label: "Jeux de stratégie", domaineKey: "lettres", domaine: "Lettres, Langues et Sciences Humaines" },
      { label: "Jeux d'équipe", domaineKey: "tourisme", domaine: "Tourisme et Autres" },
    ],
  },
  {
    id: 'q20',
    label: "Aimez-vous travailler avec des données et des statistiques ?",
    options: [
      { label: "Oui, analyser des données m'intéresse", domaineKey: "sciences", domaine: "Sciences et Technologies" },
      { label: "Non, je préfère d'autres types de travail", domaineKey: "autres", domaine: "Autres domaines" },
    ],
  },
];

export default questions; 
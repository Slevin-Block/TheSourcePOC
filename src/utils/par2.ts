import ReedSolomon from '@ronomon/reed-solomon'

function splitFileWithReedSolomon(file, dataShards, parityShards) {
  // Lire le fichier
  const fileData = fs.readFileSync(file);

  // Créer un encodeur Reed-Solomon
  const rs = ReedSolomon.create(dataShards, parityShards);

  // Calculer la taille des morceaux
  const shardLength = Math.ceil(fileData.length / dataShards);

  // Tableau pour stocker les morceaux
  const fileChunks = [];

  // Découper le fichier en morceaux
  for (let i = 0; i < dataShards; i++) {
    // Déterminer l'offset de départ et de fin pour le morceau actuel
    const startOffset = i * shardLength;
    const endOffset = Math.min((i + 1) * shardLength, fileData.length);

    // Extraire le morceau du fichier
    const chunk = fileData.slice(startOffset, endOffset);

    // Ajouter le morceau au tableau
    fileChunks.push(chunk);
  }

  // Encoder les morceaux pour ajouter les shards de parité
  rs.encode(fileChunks);

  // Retourner les morceaux encodés
  return fileChunks;
}

// Utilisation de la fonction pour découper un fichier avec Reed-Solomon
const file = 'path/to/file';
const dataShards = 4;
const parityShards = 2;
const fileChunks = splitFileWithReedSolomon(file, dataShards, parityShards);

// Afficher les morceaux encodés
console.log(fileChunks);
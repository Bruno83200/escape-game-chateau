// js/data/scenes.js — L'Héritage du Sang (31 scènes · 4 actes · 12 objets de la Besace)

export const ZONES = [
  { id: 1, roman: "I", name: "Les Oubliettes", desc: "Cellule glaciale, Couloir des rats, Salle des gardes et Herse de fer" },
  { id: 2, roman: "II", name: "Appartements Royaux", desc: "Blason de la cheminée, Bibliothèque secrète et Cabinet de curiosités" },
  { id: 3, roman: "III", name: "Aile des Savants", desc: "Laboratoire d'alchimie, Table d'optique et Herboristerie" },
  { id: 4, roman: "IV", name: "La Grande Tour", desc: "Ascenseur à contrepoids, Horloge astronomique, Observatoire, Remparts et Pont-Levis" }
];

// Catalogue complet des 12 artefacts de la Besace (noms exacts de Firestore)
export const ITEM_CATALOG = {
  "Clé des chaînes": {
    title: "Clé des chaînes",
    image: "assets/images/items/cle_chaine.webp",
    description: "Une lourde clé de fer forgé qui vous a libéré de vos entraves dans l'oubliette."
  },
  "Médaillon de Garde": {
    title: "Médaillon de Garde",
    image: "assets/images/items/medaillon.webp",
    description: "Un médaillon circulaire en bronze gravé aux armes de la garnison, taillé pour actionner la grande herse."
  },
  "Bague à Sceau": {
    title: "Bague à Sceau",
    image: "assets/images/items/bague_sceau.webp",
    description: "Une chevalière de cire pourpre ornée de l'emblème des fondateurs, recueillie derrière le blason."
  },
  "Fiole d'Ether": {
    title: "Fiole d'Ether",
    image: "assets/images/items/fiole_ether.webp",
    description: "Un flacon scellé contenant une essence volatile et lumineuse découverte dans la bibliothèque royale."
  },
  "Clé de l'Alchimiste": {
    title: "Clé de l'Alchimiste",
    image: "assets/images/items/cle_alchimiste.webp",
    description: "Une clé ciselée de symboles hermétiques ouvrant l'accès à l'Aile des Savants."
  },
  "Cristal d'Énergie": {
    title: "Cristal d'Énergie",
    image: "assets/images/items/cristal_energie.webp",
    description: "Un cristal pourpre incandescent né de l'équilibre parfait de l'alambic."
  },
  "Lentille d'Obsidienne": {
    title: "Lentille d'Obsidienne",
    image: "assets/images/items/lentille_obsidienne.webp",
    description: "Une lentille volcanique polie avec une précision géométrique redoutable."
  },
  "Poudre de Sommeil": {
    title: "Poudre de Sommeil",
    image: "assets/images/items/poudre_sommeil.webp",
    description: "Une fine poudre argentée issue des pétales de Digitale Bleue, capable d'endormir des gardes sur le champ."
  },
  "Manivelle de Bronze": {
    title: "Manivelle de Bronze",
    image: "assets/images/items/manivelle_bronze.webp",
    description: "Une manivelle robuste gravée d'ailes de dragon, pièce indispensable du pont-levis."
  },
  "Rouage d'Or": {
    title: "Rouage d'Or",
    image: "assets/images/items/rouage_or.webp",
    description: "Un engrenage ciselé d'une lune d'or, extrait du cœur de l'horloge astronomique."
  },
  "Condenseur de Vapeur": {
    title: "Condenseur de Vapeur",
    image: "assets/images/items/condenseur_vapeur.webp",
    description: "Un tube de laiton et de verre ayant condensé la vapeur givrée de l'observatoire."
  },
  "Clé du Pont-Levis": {
    title: "Clé du Pont-Levis",
    image: "assets/images/items/cle_pont_levis.webp",
    description: "Le fer de Maître pris sur les gardes endormis des remparts : la dernière pièce vers la liberté."
  }
};

// Enluminures & notes archivées dans le Grimoire au fil de l'exploration
export const CLUE_CATALOG = {
  clue_mur_n: {
    title: "L'Inscription de la Cellule",
    image: "assets/images/scenes/bg_mur_02.webp",
    text: "« Je commence la nuit et je finis le matin, deux fois dans l'année, une fois dans la journée. » → La lettre N."
  },
  clue_rats: {
    title: "Gravure des Engrenages",
    image: "assets/images/scenes/bg_mecanisme_rats.webp",
    text: "« Divise-moi deux fois par 2, ma somme est 9. » → 9 × 2 × 2 = 36."
  },
  clue_casques: {
    title: "Balance des Trois Casques",
    image: "assets/images/scenes/bg_table_gardes.webp",
    text: "Bronze = 2 kg · Argent = Bronze + Or/2 · Or = Bronze + Argent → Or = 8 kg (Argent = 6 kg)."
  },
  clue_blason: {
    title: "Blason des Fondateurs",
    image: "assets/images/scenes/bg_zoom_blason.webp",
    text: "Lion (Haut-Gauche), Serpent (Bas-Gauche), Aigle (Bas-Droite) → Au Nord de l'Aigle veille le Loup."
  },
  clue_livres: {
    title: "Chronologie des Grimoires",
    image: "assets/images/scenes/bg_zoom_livres.webp",
    text: "1240 (+5) → 1245 (+6) → 1251 (+7) → 1258 (+8) → 1266."
  },
  clue_fioles: {
    title: "Carnet du Nectar d'Éther",
    image: "assets/images/scenes/bg_zoom_fioles.webp",
    text: "Rouge 10 ml, Bleue 22 ml, Verte 7 ml → (2 × 7) + (22 − 10) = 26 ml."
  },
  clue_alambic: {
    title: "Ardoise de Transmutation",
    image: "assets/images/scenes/bg_zoom_alambic.webp",
    text: "[X] Soufre (5) + 2 Mercures (20) = 3 Essences (45) → X = 5."
  },
  clue_miroirs: {
    title: "Triangle Optique",
    image: "assets/images/scenes/bg_zoom_miroirs.webp",
    text: "Deux angles de base à 65° → Sommet = 180° − 130° = 50°."
  },
  clue_plantes: {
    title: "Herbier de la Poudre d'Argent",
    image: "assets/images/scenes/bg_zoom_plantes.webp",
    text: "Digitale Bleue (Campanula Caerulea, à gauche) produit la Poudre de Sommeil argentée."
  },
  clue_poids: {
    title: "Contrepoids de la Tour",
    image: "assets/images/scenes/bg_zoom_poids.webp",
    text: "Soleil = Lune + Étoile · Lune = 3 × Étoile · Total = 160 → Soleil = 80 (Lune = 60, Étoile = 20)."
  },
  clue_horloge: {
    title: "Cadran Astronomique",
    image: "assets/images/scenes/bg_zoom_horloge.webp",
    text: "Départ sur 12, 4 impulsions de +5 crans = 20 crans → 20 mod 12 = 8."
  },
  clue_eau: {
    title: "Console de Condensation (H₂O)",
    image: "assets/images/scenes/bg_zoom_formule.webp",
    text: "Deux atomes d'Hydrogène (H) + un atome d'Oxygène (O) = H₂O."
  },
  clue_gardes: {
    title: "Rondes des Remparts",
    image: "assets/images/scenes/bg_zoom_gardes.webp",
    text: "Rondes de 4 min et 6 min → Premier croisement simultané (PPCM) à 12 minutes."
  },
  clue_pont: {
    title: "Devise du Pont-Levis",
    image: "assets/images/scenes/bg_zoom_mecanisme_final.webp",
    text: "« 3 tours de Lune d'Or (Rouage), 2 ailes de Dragon (Manivelle), 1 fer de Maître (Clé) » → 3 · 2 · 1."
  }
};

export const SCENE_ORDER = [
  "cellule", "mur_enigme", "couloir_01", "couloir_rats", "zoom_mecanisme",
  "salle_des_gardes", "table_gardes", "grille_fer",
  "antichambre", "zoom_blason", "bibliotheque", "zoom_livres", "cabinet_curiosites", "zoom_cabinet",
  "laboratoire_alchimie", "zoom_alambic", "table_geometrie", "zoom_miroirs", "herboristerie", "zoom_plantes",
  "ascenseur_tour", "zoom_poids", "horloge_astro", "zoom_horloge", "observatoire", "zoom_formule",
  "chemin_ronde", "zoom_gardes", "pont_levis", "zoom_mecanisme_final", "victoire"
];

export const scenes = {
  "cellule": {
    zone: 1, step: 1, title: "La Cellule Glaciale",
    text: "Vous reprenez conscience dans une cellule glaciale. Vos mains sont enchaînées au mur. Une odeur de salpêtre sature l'air.",
    hint: "Observez attentivement les murs de pierre : un prisonnier y a gravé une énigme.",
    image: "assets/images/scenes/bg_cellule_01.webp",
    ambience: "gouttes",
    choices: [
      { text: "Observer les murs", next: "mur_enigme", icon: "eye", primary: true },
      { text: "Tirer sur les chaînes", action: "tirerChaines", icon: "lock" }
    ]
  },
  "mur_enigme": {
    zone: 1, step: 2, title: "L'Inscription sur la Pierre",
    text: "Sur une pierre humide, une inscription est gravée : « Je commence la nuit et je finis le matin, j'apparais deux fois dans l'année et une seule fois dans la journée. Qui suis-je ? »",
    hint: "Regardez les lettres des mots : Nuit (début), matiN (fin), aNNée (deux fois), jourNée (une fois) → la lettre N !",
    image: "assets/images/scenes/bg_mur_02.webp",
    ambience: "gouttes",
    choices: [
      { text: "Graver la réponse", action: "verifierEnigmeN", icon: "feather", primary: true },
      { text: "Retourner au centre", next: "cellule", icon: "back" }
    ]
  },
  "couloir_01": {
    zone: 1, step: 3, title: "Le Seuil de l'Oubliette",
    text: "Les chaînes sont tombées ! La porte de la cellule a pivoté. Vous débouchez dans un couloir sombre. Des rats bloquent le passage au loin.",
    image: "assets/images/scenes/bg_cellule_01.webp",
    ambience: null,
    choices: [
      { text: "S'avancer vers les rats", next: "couloir_rats", icon: "arrow", primary: true }
    ]
  },
  "couloir_rats": {
    zone: 1, step: 4, title: "Le Couloir des Rats",
    text: "Des dizaines de rats grincent des dents. Un mécanisme complexe est incrusté dans le mur humide.",
    image: "assets/images/scenes/bg_couloir_03.webp",
    ambience: "rats",
    loop: false,
    choices: [
      { text: "Examiner le mécanisme", next: "zoom_mecanisme", icon: "gear", primary: true },
      { text: "Reculer", next: "couloir_01", icon: "back" }
    ]
  },
  "zoom_mecanisme": {
    zone: 1, step: 5, title: "Les Engrenages de la Trappe",
    text: "Le mécanisme attend un nombre précis. Une gravure indique : « Seul le nombre parfait ouvrira la voie. »",
    hint: "Si vous divisez un nombre deux fois par 2 pour obtenir 9, faites l'inverse : 9 × 2 × 2 = 36.",
    image: "assets/images/scenes/bg_mecanisme_rats.webp",
    ambience: "rats",
    loop: false,
    choices: [
      { text: "Actionner les engrenages", action: "enigmeMathRats", icon: "gear", primary: true },
      { text: "S'éloigner", next: "couloir_rats", icon: "back" }
    ]
  },
  "salle_des_gardes": {
    zone: 1, step: 6, title: "La Salle des Gardes",
    text: "La trappe a aspiré les rats ! Vous arrivez dans la salle des gardes. Des armures vides semblent vous surveiller. Une lourde table en chêne trône au centre de la pièce.",
    image: "assets/images/scenes/bg_salle_gardes.webp",
    ambience: null,
    choices: [
      { text: "S'approcher de la table", next: "table_gardes", icon: "scale", primary: true },
      { text: "Fouiller les râteliers", action: "fouillerRateliers", icon: "search" }
    ]
  },
  "table_gardes": {
    zone: 1, step: 7, title: "La Balance des Trois Casques",
    text: "Trois casques de cérémonie sont posés sur la table, devant une balance étrange. Une plaque de cuivre semble porter une inscription.",
    hint: "Bronze = 2 kg. Si Or = 8 kg, alors Argent = 2 + 4 = 6 kg, et Or = Bronze + Argent = 2 + 6 = 8 kg !",
    image: "assets/images/scenes/bg_table_gardes.webp",
    ambience: null,
    choices: [
      { text: "Peser les casques", action: "enigmeCasqueOr", icon: "scale", primary: true },
      { text: "Revenir en arrière", next: "salle_des_gardes", icon: "back" }
    ]
  },
  "grille_fer": {
    zone: 1, step: 8, title: "La Grande Herse de Fer",
    text: "Une immense herse de fer bloque le passage. Un froid glacial provient de l'autre côté. À droite de la herse, une fente circulaire semble attendre un objet particulier.",
    hint: "Insérez le Médaillon de Garde recueilli sur la table de la salle précédente.",
    image: "assets/images/scenes/bg_grille_fer.webp",
    ambience: null,
    choices: [
      { text: "Insérer le Médaillon", action: "utiliserMedaillon", icon: "key", primary: true },
      { text: "Revenir à la salle des gardes", next: "salle_des_gardes", icon: "back" }
    ]
  },
  "antichambre": {
    zone: 2, step: 9, title: "L'Antichambre Royale",
    text: "L'air est ici plus lourd, chargé d'une odeur de poussière et d'ancien encens. Les Appartements Royaux s'ouvrent à vous. Une cheminée monumentale attire votre regard.",
    image: "assets/images/scenes/bg_antichambre.webp",
    ambience: "feu",
    choices: [
      { text: "Examiner la cheminée", next: "zoom_blason", icon: "shield", primary: true },
      { text: "Fouiller les tapisseries", action: "fouillerTapisseries", icon: "search" }
    ]
  },
  "zoom_blason": {
    zone: 2, step: 10, title: "Le Blason des Fondateurs",
    text: "Le blason des fondateurs est gravé dans la pierre. Quatre animaux devaient y siéger, mais certaines gravures sont effacées : on devine encore la silhouette d'un canidé sur la partie supérieure droite.",
    hint: "La silhouette d'un canidé prédateur qui veille au Nord de l'Aigle : le Loup.",
    image: "assets/images/scenes/bg_zoom_blason.webp",
    ambience: "feu",
    choices: [
      { text: "Compléter le blason", action: "enigmeBlasonLoup", icon: "shield", primary: true },
      { text: "Revenir dans la pièce", next: "antichambre", icon: "back" }
    ]
  },
  "bibliotheque": {
    zone: 2, step: 11, title: "La Bibliothèque Royale",
    text: "La porte secrète pivotée, vous entrez dans une bibliothèque royale colossale. Des milliers de grimoires dorment ici. Une étagère semble avoir été manipulée récemment.",
    image: "assets/images/scenes/bg_bibliotheque.webp",
    ambience: null,
    choices: [
      { text: "Examiner l'étagère", next: "zoom_livres", icon: "book", primary: true },
      { text: "Revenir à l'antichambre", next: "antichambre", icon: "back" }
    ]
  },
  "zoom_livres": {
    zone: 2, step: 12, title: "La Suite des Grimoires",
    text: "Une suite de vieux livres porte des dates dorées : 1240, 1245, 1251, 1258… Un emplacement est vide, attendant le livre qui complètera la suite.",
    hint: "Observez les écarts entre chaque tome : +5, +6, +7… le suivant ajoute donc +8 : 1258 + 8 = 1266.",
    image: "assets/images/scenes/bg_zoom_livres.webp",
    ambience: null,
    choices: [
      { text: "Placer le livre manquant", action: "enigmeLivresDates", icon: "book", primary: true },
      { text: "S'éloigner", next: "bibliotheque", icon: "back" }
    ]
  },
  "cabinet_curiosites": {
    zone: 2, step: 13, title: "Le Cabinet de Curiosités",
    text: "L'air sature de vapeurs d'éther. Des fioles colorées attendent sur un trépied. Un carnet de notes donne les instructions de dosage.",
    image: "assets/images/scenes/bg_cabinet.webp",
    ambience: "bubbles",
    choices: [
      { text: "Examiner les fioles", next: "zoom_cabinet", icon: "flask", primary: true },
      { text: "Retourner à la bibliothèque", next: "bibliotheque", icon: "back" }
    ]
  },
  "zoom_cabinet": {
    zone: 2, step: 14, title: "Les Trois Fioles d'Éther",
    text: "Trois fioles (Rouge : 10 ml, Bleue : 22 ml, Verte : 7 ml) sont prêtes sur l'établi. Le carnet détaille le calcul précis à effectuer.",
    hint: "Double de la plus petite (2 × 7 = 14) + différence entre la plus grande et la moyenne (22 − 10 = 12) = 26 ml.",
    image: "assets/images/scenes/bg_zoom_fioles.webp",
    ambience: "bubbles",
    choices: [
      { text: "Préparer le Nectar d'Éther", action: "enigmeFiolesEther", icon: "flask", primary: true },
      { text: "Reculer", next: "cabinet_curiosites", icon: "back" }
    ]
  },
  "laboratoire_alchimie": {
    zone: 3, step: 15, title: "Le Laboratoire d'Alchimie",
    text: "Des sifflements de vapeur s'échappent des tuyaux de cuivre. Au centre, un alambic monumental semble être le cœur de la pièce. Un établi sur le côté attire votre attention.",
    image: "assets/images/scenes/bg_laboratoire.webp",
    ambience: "vapeur",
    choices: [
      { text: "Examiner l'établi", next: "zoom_alambic", icon: "flask", primary: true },
      { text: "Retourner au cabinet", next: "cabinet_curiosites", icon: "back" }
    ]
  },
  "zoom_alambic": {
    zone: 3, step: 16, title: "L'Alambic de Transmutation",
    text: "Une ardoise poussiéreuse indique une formule de transmutation inachevée. Vous devez déterminer la quantité exacte de Soufre nécessaire.",
    hint: "3 Essences = 45. 2 Mercures = 20. Il reste 25 à combler avec du Soufre (valeur 5) : 25 ÷ 5 = 5 doses.",
    image: "assets/images/scenes/bg_zoom_alambic.webp",
    ambience: "vapeur",
    choices: [
      { text: "Équilibrer l'alambic", action: "enigmeAlchimieEquilibre", icon: "flask", primary: true },
      { text: "S'éloigner", next: "laboratoire_alchimie", icon: "back" }
    ]
  },
  "table_geometrie": {
    zone: 3, step: 17, title: "La Table d'Optique",
    text: "Une lumière pure traverse la pièce et vient frapper une table de pierre gravée. Un mécanisme de miroirs attend d'être ajusté pour diriger le faisceau.",
    image: "assets/images/scenes/bg_geometrie.webp",
    ambience: "optique",
    loop: false,
    choices: [
      { text: "Examiner les miroirs", next: "zoom_miroirs", icon: "sun", primary: true },
      { text: "Revenir au laboratoire", next: "laboratoire_alchimie", icon: "back" }
    ]
  },
  "zoom_miroirs": {
    zone: 3, step: 18, title: "Le Disque des Miroirs",
    text: "Le socle des miroirs indique deux angles de 65°. Une inscription dit : « Clôt le triangle pour voir la vérité ». Quel angle doit prendre le sommet ?",
    hint: "La somme des angles d'un triangle vaut toujours 180° : 180° − (65° + 65°) = 50°.",
    image: "assets/images/scenes/bg_zoom_miroirs.webp",
    ambience: "optique",
    loop: false,
    choices: [
      { text: "Régler l'angle optique", action: "enigmeGeometrieAngles", icon: "sun", primary: true },
      { text: "S'éloigner", next: "table_geometrie", icon: "back" }
    ]
  },
  "herboristerie": {
    zone: 3, step: 19, title: "L'Herboristerie Secrète",
    text: "Une odeur apaisante de plantes séchées embaume la pièce. Sur une étagère, trois plantes singulières semblent attendre d'être préparées selon les instructions du grimoire.",
    image: "assets/images/scenes/bg_herboristerie.webp",
    ambience: "herbo",
    choices: [
      { text: "Examiner les plantes", next: "zoom_plantes", icon: "leaf", primary: true },
      { text: "Revenir à la table d'optique", next: "table_geometrie", icon: "back" }
    ]
  },
  "zoom_plantes": {
    zone: 3, step: 20, title: "Les Trois Plantes Singulières",
    text: "Trois plantes (Digitale Bleue, Mandragore Jaune, Belladone Pourpre) sont alignées. Le grimoire indique laquelle doit être broyée pour obtenir la poudre d'argent.",
    hint: "Les pétales bleus de la Digitale (Campanula Caerulea, tout à gauche) fournissent la Poudre de Sommeil argentée.",
    image: "assets/images/scenes/bg_zoom_plantes.webp",
    ambience: "herbo",
    choices: [
      { text: "Choisir et broyer une plante", action: "enigmeHerboristerie", icon: "leaf", primary: true },
      { text: "S'éloigner", next: "herboristerie", icon: "back" }
    ]
  },
  "ascenseur_tour": {
    zone: 4, step: 21, title: "L'Ascenseur de la Grande Tour",
    text: "Vous atteignez la base de la Grande Tour. Un ascenseur massif barre la route. Pour l'activer, vous devez régler les contrepoids sur le panneau latéral.",
    image: "assets/images/scenes/bg_ascenseur.webp",
    ambience: "vent",
    choices: [
      { text: "Examiner le panneau", next: "zoom_poids", icon: "gear", primary: true },
      { text: "Revenir à l'herboristerie", next: "herboristerie", icon: "back" }
    ]
  },
  "zoom_poids": {
    zone: 4, step: 22, title: "Les Contrepoids de Laiton",
    text: "Trois curseurs (Soleil, Lune, Étoile) doivent être équilibrés. La stèle indique : « Le Soleil vaut la Lune et l'Étoile. La Lune est triple de l'Étoile. Le tout pèse 160. »",
    hint: "Comme Soleil = Lune + Étoile et Total = Soleil + (Lune + Étoile) = 160, le Soleil vaut exactement la moitié : 80 (Lune = 60, Étoile = 20).",
    image: "assets/images/scenes/bg_zoom_poids.webp",
    ambience: "vent",
    choices: [
      { text: "Régler les contrepoids", action: "enigmeAscenseurPoids", icon: "gear", primary: true },
      { text: "S'éloigner", next: "ascenseur_tour", icon: "back" }
    ]
  },
  "horloge_astro": {
    zone: 4, step: 23, title: "L'Horloge Astronomique",
    text: "L'ascenseur vous dépose au sommet de la tour. Une horloge astronomique monumentale occupe tout le mur. Ses aiguilles dorées semblent attendre une impulsion précise pour libérer le mécanisme final.",
    image: "assets/images/scenes/bg_horloge_astro.webp",
    ambience: "tic_tac",
    choices: [
      { text: "Observer le cadran", next: "zoom_horloge", icon: "clock", primary: true },
      { text: "Redescendre à l'ascenseur", next: "ascenseur_tour", icon: "back" }
    ]
  },
  "zoom_horloge": {
    zone: 4, step: 24, title: "Le Cadran des Douze Signes",
    text: "Le cadran est divisé en 12 signes. Une plaque indique : « Le Soleil avance de 5 crans par impulsion. S'il part du 12 et reçoit 4 impulsions, où s'arrêtera-t-il ? »",
    hint: "4 impulsions × 5 crans = 20 crans. Un tour complet fait 12 crans : 20 − 12 = 8 (VIII).",
    image: "assets/images/scenes/bg_zoom_horloge.webp",
    ambience: "tic_tac",
    choices: [
      { text: "Régler l'aiguille du Soleil", action: "enigmeHorlogeAstro", icon: "clock", primary: true },
      { text: "S'éloigner", next: "horloge_astro", icon: "back" }
    ]
  },
  "observatoire": {
    zone: 4, step: 25, title: "L'Observatoire sous les Toits",
    text: "L'horloge a pivoté, révélant un petit observatoire niché sous les toits de la tour. Un mécanisme de stabilisation semble bloquer l'accès final aux remparts.",
    image: "assets/images/scenes/bg_observatoire.webp",
    ambience: "vent_haut",
    choices: [
      { text: "Examiner la console", next: "zoom_formule", icon: "flask", primary: true },
      { text: "Revenir à l'horloge", next: "horloge_astro", icon: "back" }
    ]
  },
  "zoom_formule": {
    zone: 4, step: 26, title: "La Console de Condensation",
    text: "Une plaque indique qu'il faut injecter l'élément le plus léger pour condenser la vapeur (H₂O) et libérer le verrou. Vous avez déjà l'Oxygène (O).",
    hint: "L'eau a pour formule H₂O : injectez deux fois l'Hydrogène (symbole H).",
    image: "assets/images/scenes/bg_zoom_formule.webp",
    ambience: "vent_haut",
    choices: [
      { text: "Manipuler les vannes", action: "enigmeStabilisationEau", icon: "flask", primary: true },
      { text: "S'éloigner", next: "observatoire", icon: "back" }
    ]
  },
  "chemin_ronde": {
    zone: 4, step: 27, title: "Le Chemin de Ronde",
    text: "Vous sortez sur les remparts. Le vent nocturne siffle entre les créneaux. Deux gardes lourdement armés discutent près d'un brasero, bloquant l'accès à la porte du pont-levis.",
    image: "assets/images/scenes/bg_chemin_ronde.webp",
    ambience: "nuit",
    choices: [
      { text: "Observer les gardes", next: "zoom_gardes", icon: "eye", primary: true },
      { text: "Revenir à l'horloge", next: "horloge_astro", icon: "back" }
    ]
  },
  "zoom_gardes": {
    zone: 4, step: 28, title: "Les Gardes du Brasero",
    text: "Les gardes font leurs rondes. L'un met 4 minutes, l'autre 6 minutes. Vous devez utiliser votre Poudre de Sommeil au moment exact où ils se croisent.",
    hint: "Multiples de 4 : 4, 8, 12. Multiples de 6 : 6, 12. Ils se croisent exactement à la 12e minute !",
    image: "assets/images/scenes/bg_zoom_gardes.webp",
    ambience: "nuit",
    choices: [
      { text: "Synchroniser la Poudre de Sommeil", action: "verifierPoudreEtEnigme", icon: "clock", primary: true },
      { text: "S'éloigner", next: "chemin_ronde", icon: "back" }
    ]
  },
  "pont_levis": {
    zone: 4, step: 29, title: "L'Ultime Porte du Pont-Levis",
    text: "Devant vous se dresse l'ultime porte. Le mécanisme du pont-levis est là, imposant et complexe. La liberté n'est qu'à quelques engrenages.",
    image: "assets/images/scenes/bg_pont_levis.webp",
    ambience: "espoir",
    choices: [
      { text: "Examiner le mécanisme", next: "zoom_mecanisme_final", icon: "gear", primary: true },
      { text: "Retourner sur les remparts", next: "chemin_ronde", icon: "back" }
    ]
  },
  "zoom_mecanisme_final": {
    zone: 4, step: 30, title: "Le Boîtier du Pont-Levis",
    text: "Le boîtier attend ses pièces. Une inscription dit : « 3 tours de Lune d'Or, 2 ailes de Dragon, 1 fer de Maître ». Vous devez insérer vos objets et entrer le code de rotation.",
    hint: "Insérez le Rouage d'Or, la Manivelle de Bronze et la Clé du Pont-Levis, puis réglez le code de rotation sur 3 · 2 · 1.",
    image: "assets/images/scenes/bg_zoom_mecanisme_final.webp",
    ambience: "espoir",
    choices: [
      { text: "Actionner le mécanisme final", action: "verifierObjetsFinaux", icon: "key", primary: true },
      { text: "S'éloigner", next: "pont_levis", icon: "back" }
    ]
  },
  "victoire": {
    zone: 4, step: 31, title: "La Liberté Retrouvée",
    text: "Le pont s'abat dans un fracas libérateur. L'air frais de la vallée vous fouette le visage. Vous avez brisé l'Héritage du Sang. Vous faites partie des évadés du château. Vous êtes libre !",
    image: "assets/images/scenes/bg_liberte.webp",
    ambience: "espoir",
    choices: [
      { text: "Voir la Liste des Évadés", action: "afficherLesEvades", icon: "award", primary: true },
      { text: "Recommencer l'aventure", action: "demandeRejouer", icon: "arrow" }
    ]
  }
};

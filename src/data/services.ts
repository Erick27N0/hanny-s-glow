import boutiqueImg from "@/assets/boutique.jpg";
import heroSalon from "@/assets/hero-salon.jpg";
import extensionsImg from "@/assets/product-extensions.jpg";
import careImg from "@/assets/product-care.jpg";

export type ServiceCategory =
  | "Tresses"
  | "Tissages"
  | "Extensions"
  | "Soins"
  | "Locks";

export type Service = {
  id: string;
  name: string;
  category: ServiceCategory;
  description: string;
  longDescription: string;
  durationMinutes: number;
  priceFrom: number;
  priceNote?: string;
  image: string;
  benefits: string[];
  steps: { title: string; detail: string }[];
  included: string[];
  aftercare: string[];
  faqs: { q: string; a: string }[];
};

const categoryImage: Record<ServiceCategory, string> = {
  Tresses: boutiqueImg,
  Tissages: heroSalon,
  Extensions: extensionsImg,
  Locks: heroSalon,
  Soins: careImg,
};

const commonStepsBraids = [
  {
    title: "Diagnostic capillaire",
    detail:
      "Analyse du cuir chevelu et de la fibre, choix de la taille, de la longueur et de la couleur des mèches.",
  },
  {
    title: "Préparation",
    detail:
      "Démêlage doux, lavage clarifiant si nécessaire, application d'un soin protecteur sur les longueurs.",
  },
  {
    title: "Réalisation",
    detail:
      "Tressage section par section avec une tension douce et régulière, pensée pour respecter votre cuir chevelu.",
  },
  {
    title: "Finitions",
    detail:
      "Scellement à l'eau chaude ou à la cire végétale, mise en forme et conseils d'entretien personnalisés.",
  },
];

const commonAftercare = [
  "Couvrir les cheveux la nuit avec un foulard en satin ou une taie d'oreiller soie.",
  "Hydrater le cuir chevelu deux fois par semaine avec un spray sans rinçage.",
  "Éviter les tensions répétées (queue haute serrée, casque, etc.) les premiers jours.",
];

export const services: Service[] = [
  {
    id: "box-braids",
    name: "Box braids",
    category: "Tresses",
    description:
      "Tresses classiques rectangulaires, longueur et épaisseur au choix.",
    longDescription:
      "Les box braids restent la coiffure protectrice la plus polyvalente : épaisseur médium ou jumbo, longueur épaule à taille, finitions droites ou bouclées. Idéal pour reposer les cheveux naturels jusqu'à 6 semaines.",
    durationMinutes: 300,
    priceFrom: 120,
    priceNote: "Le tarif final dépend de la longueur et de la taille des tresses.",
    image: categoryImage.Tresses,
    benefits: [
      "Protège les cheveux naturels et favorise la pousse",
      "Coiffure 4 à 6 semaines sans entretien lourd",
      "Adaptable à toutes les longueurs de cheveux",
    ],
    steps: commonStepsBraids,
    included: [
      "Diagnostic personnalisé",
      "Mèches Kanekalon premium (couleurs au choix)",
      "Lavage clarifiant si besoin",
      "Kit d'entretien offert (spray + foulard satin)",
    ],
    aftercare: commonAftercare,
    faqs: [
      {
        q: "Combien de temps ça tient ?",
        a: "Entre 4 et 6 semaines avec un entretien régulier. Au-delà, le risque de tension sur les racines augmente.",
      },
      {
        q: "Est-ce douloureux ?",
        a: "Nous travaillons avec une tension douce, jamais excessive. Vous pouvez nous indiquer tout inconfort en cours de prestation.",
      },
    ],
  },
  {
    id: "knotless-braids",
    name: "Knotless braids",
    category: "Tresses",
    description:
      "Tresses sans nœud, plus légères et respectueuses du cuir chevelu.",
    longDescription:
      "La technique knotless démarre directement sur votre cheveu naturel : aucun nœud à la racine, donc zéro tension dès la pose. Résultat plus naturel, plus confortable et idéal pour les cuirs chevelus sensibles.",
    durationMinutes: 360,
    priceFrom: 150,
    priceNote: "Pose plus longue qu'une box braid classique.",
    image: categoryImage.Tresses,
    benefits: [
      "Zéro tension à la racine, confort immédiat",
      "Rendu très naturel dès le premier jour",
      "Idéal en cas de cuir chevelu sensible ou de cheveux fragilisés",
    ],
    steps: commonStepsBraids,
    included: [
      "Diagnostic personnalisé",
      "Mèches Kanekalon premium",
      "Technique feed-in sans nœud",
      "Kit d'entretien offert",
    ],
    aftercare: commonAftercare,
    faqs: [
      {
        q: "Différence avec les box braids ?",
        a: "Les knotless intègrent vos cheveux progressivement, sans nœud de départ. Pose plus longue mais plus confortable et durable.",
      },
    ],
  },
  {
    id: "twists-senegalais",
    name: "Twists sénégalais",
    category: "Tresses",
    description: "Twists élégants à mèches longues, finition impeccable.",
    longDescription:
      "Deux mèches torsadées entre elles pour un rendu lisse et brillant. Une coiffure protectrice élégante, idéale pour les occasions comme pour le quotidien.",
    durationMinutes: 300,
    priceFrom: 130,
    image: categoryImage.Tresses,
    benefits: [
      "Finition brillante et soignée",
      "Tient 4 à 6 semaines",
      "Facile à coiffer (chignon, demi-attache, etc.)",
    ],
    steps: commonStepsBraids,
    included: [
      "Diagnostic personnalisé",
      "Mèches premium",
      "Scellement à l'eau chaude",
      "Kit d'entretien offert",
    ],
    aftercare: commonAftercare,
    faqs: [
      {
        q: "Puis-je les attacher ?",
        a: "Oui, dès la pose. Évitez seulement les attaches très serrées les premiers jours.",
      },
    ],
  },
  {
    id: "tissage-cousu",
    name: "Tissage cousu",
    category: "Tissages",
    description:
      "Tissage cousu main sur tresses, naturel et longue tenue.",
    longDescription:
      "Vos cheveux sont tressés en couronne puis le tissage est cousu main, mèche par mèche. Une méthode protectrice qui offre un rendu naturel et tient 6 à 8 semaines.",
    durationMinutes: 180,
    priceFrom: 90,
    priceNote: "Hors prix des mèches/cheveux naturels.",
    image: categoryImage.Tissages,
    benefits: [
      "Rendu très naturel, raie indétectable possible",
      "Aucune colle, zéro tension excessive",
      "Mèches réutilisables plusieurs fois",
    ],
    steps: [
      {
        title: "Diagnostic & conseil mèches",
        detail:
          "Choix de la texture, de la couleur et de la longueur en fonction de votre nature de cheveux.",
      },
      {
        title: "Tressage en couronne",
        detail:
          "Vos cheveux sont tressés à plat pour servir de base solide au tissage.",
      },
      {
        title: "Couture du tissage",
        detail:
          "Pose mèche par mèche cousue main, contour discret.",
      },
      {
        title: "Coiffage final",
        detail: "Brushing, ondulations ou lissage selon votre demande.",
      },
    ],
    included: [
      "Diagnostic personnalisé",
      "Tressage de base",
      "Pose cousue main",
      "Coiffage final",
    ],
    aftercare: [
      "Lavez le tissage tous les 7 à 10 jours avec un shampoing doux.",
      "Hydratez vos cheveux naturels via les raies entre les tresses de base.",
      "Couvrez vos cheveux la nuit avec un foulard satin.",
    ],
    faqs: [
      {
        q: "Combien de temps ça dure ?",
        a: "6 à 8 semaines maximum, avec une visite de contrôle conseillée à 4 semaines.",
      },
      {
        q: "Vous fournissez les mèches ?",
        a: "Nous vous conseillons sur les mèches à acheter ou vous proposons une sélection en salon.",
      },
    ],
  },
  {
    id: "tissage-colle",
    name: "Tissage à la colle",
    category: "Tissages",
    description: "Pose rapide pour un volume immédiat, sans tension.",
    longDescription:
      "Le tissage à la colle est la solution la plus rapide pour gagner en longueur et en volume. Idéal pour un événement ou un changement express. Pose et dépose en salon pour préserver vos cheveux.",
    durationMinutes: 120,
    priceFrom: 70,
    image: categoryImage.Tissages,
    benefits: [
      "Pose express en moins de 2h",
      "Effet volume immédiat",
      "Idéal pour un événement",
    ],
    steps: [
      {
        title: "Diagnostic",
        detail: "Vérification de l'état du cuir chevelu et choix des mèches.",
      },
      {
        title: "Protection du cuir chevelu",
        detail: "Application d'un film protecteur avant la colle.",
      },
      {
        title: "Pose",
        detail: "Collage des trames mèche par mèche.",
      },
      {
        title: "Coiffage",
        detail: "Brushing ou bouclage selon votre style.",
      },
    ],
    included: [
      "Diagnostic personnalisé",
      "Protection cuir chevelu",
      "Pose à la colle",
      "Coiffage final",
    ],
    aftercare: [
      "Évitez l'eau très chaude et les shampoings agressifs.",
      "Dépose en salon impérative au bout de 3 à 4 semaines max.",
    ],
    faqs: [
      {
        q: "Combien de temps ça tient ?",
        a: "3 à 4 semaines maximum. Au-delà, on risque d'abîmer le cheveu naturel.",
      },
      {
        q: "Est-ce que ça abîme les cheveux ?",
        a: "Pas si la pose et la dépose sont faites en salon, avec protection préalable du cuir chevelu.",
      },
    ],
  },
  {
    id: "extensions-keratine",
    name: "Extensions à la kératine",
    category: "Extensions",
    description:
      "Extensions discrètes posées mèche par mèche pour un rendu naturel.",
    longDescription:
      "La kératine est fondue à chaud pour souder l'extension à votre mèche. Discret, durable (3 à 4 mois), idéal pour densifier ou allonger sans tissage visible.",
    durationMinutes: 180,
    priceFrom: 200,
    priceNote: "Hors prix des mèches (devis personnalisé).",
    image: categoryImage.Extensions,
    benefits: [
      "Invisibles, indétectables au toucher",
      "Tient 3 à 4 mois",
      "Permet shampoing, brushing, attache haute",
    ],
    steps: [
      {
        title: "Diagnostic & devis",
        detail: "Évaluation du nombre de mèches nécessaires, choix de la qualité.",
      },
      {
        title: "Préparation",
        detail: "Lavage et séchage parfait avant la pose.",
      },
      {
        title: "Pose à chaud",
        detail: "Fusion mèche par mèche à la pince chauffante.",
      },
      {
        title: "Coupe & coiffage",
        detail: "Coupe d'ajustement pour fondre les extensions à vos cheveux.",
      },
    ],
    included: [
      "Diagnostic personnalisé",
      "Pose mèche par mèche",
      "Coupe d'ajustement",
      "Conseils d'entretien",
    ],
    aftercare: [
      "Brosse adaptée aux extensions (poils souples).",
      "Shampoing sans sulfates, sans silicone sur les attaches.",
      "Tresse lâche la nuit pour éviter les nœuds.",
    ],
    faqs: [
      {
        q: "Mes cheveux sont-ils abîmés ?",
        a: "Non si la dépose est faite avec le solvant adapté en salon, en fin de cycle.",
      },
      {
        q: "Combien faut-il de mèches ?",
        a: "Entre 75 et 150 selon la densité naturelle. Devis précis au diagnostic.",
      },
    ],
  },
  {
    id: "locks-entretien",
    name: "Entretien locks",
    category: "Locks",
    description: "Retouche des racines, lavage et soin profond.",
    longDescription:
      "Retouche des racines au crochet ou à la paume, lavage clarifiant et soin profond. À prévoir toutes les 6 à 8 semaines pour des locks nettes et saines.",
    durationMinutes: 120,
    priceFrom: 60,
    image: categoryImage.Locks,
    benefits: [
      "Racines nettes et propres",
      "Cuir chevelu apaisé",
      "Locks régulières et alignées",
    ],
    steps: [
      {
        title: "Diagnostic locks",
        detail: "État du cuir chevelu, des racines et du corps des locks.",
      },
      {
        title: "Lavage clarifiant",
        detail: "Élimination des résidus de produits et impuretés.",
      },
      {
        title: "Retouche",
        detail: "Resserrage racine par racine au crochet ou paumage.",
      },
      {
        title: "Soin & séchage",
        detail: "Application d'un soin léger, séchage capot ou air libre.",
      },
    ],
    included: [
      "Lavage clarifiant",
      "Retouche complète",
      "Soin du cuir chevelu",
      "Conseils d'entretien à domicile",
    ],
    aftercare: [
      "Pulvérisez de l'eau florale sur le cuir chevelu 2 à 3 fois par semaine.",
      "Couvrez vos locks la nuit (bonnet satin).",
      "Évitez les huiles trop lourdes qui chargent les locks.",
    ],
    faqs: [
      {
        q: "À quelle fréquence revenir ?",
        a: "Toutes les 6 à 8 semaines pour un rendu optimal.",
      },
    ],
  },
  {
    id: "soin-cuir-chevelu",
    name: "Soin cuir chevelu",
    category: "Soins",
    description: "Diagnostic, gommage, masque nourrissant et massage.",
    longDescription:
      "Un protocole complet pour assainir, nourrir et stimuler le cuir chevelu. Recommandé avant une pose protectrice ou en cure mensuelle pour relancer la pousse.",
    durationMinutes: 60,
    priceFrom: 40,
    image: categoryImage.Soins,
    benefits: [
      "Cuir chevelu apaisé et débarrassé des impuretés",
      "Stimule la microcirculation et la pousse",
      "Prépare idéalement à une pose protectrice",
    ],
    steps: [
      {
        title: "Diagnostic à la caméra",
        detail: "Analyse du cuir chevelu (sébum, sécheresse, irritations).",
      },
      {
        title: "Gommage doux",
        detail: "Élimination des cellules mortes et résidus de produits.",
      },
      {
        title: "Masque nourrissant",
        detail: "Masque ciblé selon votre diagnostic, temps de pose 15 min.",
      },
      {
        title: "Massage stimulant",
        detail: "Massage relaxant pour activer la microcirculation.",
      },
    ],
    included: [
      "Diagnostic à la caméra",
      "Gommage cuir chevelu",
      "Masque sur-mesure",
      "Massage 10 minutes",
    ],
    aftercare: [
      "Espacez les shampoings d'au moins 48h après le soin.",
      "Évitez les produits coiffants à base de silicones les 3 jours suivants.",
    ],
    faqs: [
      {
        q: "À quelle fréquence ?",
        a: "Une fois par mois en entretien, ou avant chaque pose protectrice.",
      },
    ],
  },
];

export const formatDuration = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  if (m === 0) return `${h}h`;
  return `${h}h${m}`;
};

export const getServiceById = (id: string) =>
  services.find((s) => s.id === id);

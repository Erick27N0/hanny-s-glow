import wig1 from "@/assets/product-wig-1.jpg";
import wig2 from "@/assets/product-wig-2.jpg";
import extensions from "@/assets/product-extensions.jpg";
import care from "@/assets/product-care.jpg";

export type MedicalDetails = {
  color: string;
  colorFamily: "Brun" | "Châtain" | "Blond" | "Noir" | "Roux";
  style: "Lisse" | "Ondulée" | "Bouclée" | "Frisée";
  cap: string;
  density: "Légère" | "Moyenne" | "Dense";
  faceShapes: string[];
  bestFor: string[];
  included: string[];
  care: string[];
};

export type Product = {
  slug: string;
  name: string;
  category: "Perruques médicales" | "Perruques" | "Extensions" | "Soins";
  shortDescription: string;
  description: string;
  hairType: string;
  length: string;
  price: number;
  inStock: boolean;
  image: string;
  highlights: string[];
  medical?: MedicalDetails;
};

export const products: Product[] = [
  {
    slug: "perruque-medicale-lisse-mid",
    name: "Perruque médicale — Lisse mi-longue",
    category: "Perruques médicales",
    shortDescription: "Cheveux naturels, monture confort respirante.",
    description:
      "Perruque médicale en cheveux naturels remy, monture lace front réglable, particulièrement adaptée après traitement oncologique. Éligible au remboursement Sécurité sociale (LPPR).",
    hairType: "Cheveux naturels Remy",
    length: "35 cm",
    price: 690,
    inStock: true,
    image: wig1,
    highlights: ["Éligible Sécu", "Lace front", "Monture respirante", "Pose offerte"],
    medical: {
      color: "Châtain naturel",
      colorFamily: "Châtain",
      style: "Lisse",
      cap: "Lace front + monture confort réglable (51 à 56 cm)",
      density: "Moyenne",
      faceShapes: ["Ovale", "Rond", "Cœur"],
      bestFor: [
        "Premier port après chimiothérapie",
        "Recherche d'un rendu discret et naturel",
      ],
      included: [
        "Essayage privé d'1h en cabine dédiée",
        "Ajustement & coupe personnalisée",
        "Pose offerte le jour de la livraison",
        "Tiers payant Sécu pris en charge",
      ],
      care: [
        "Lavage doux tous les 10 à 15 ports",
        "Sèche à l'air libre sur tête polystyrène",
        "Brossage avec peigne à dents larges uniquement",
      ],
    },
  },
  {
    slug: "perruque-medicale-bouclee",
    name: "Perruque médicale — Bouclée volumineuse",
    category: "Perruques médicales",
    shortDescription: "Bouclage afro naturel, confort longue durée.",
    description:
      "Perruque médicale bouclée, fibres premium texture afro, monture anti-allergique. Conseil personnalisé en salon pour adaptation à la morphologie.",
    hairType: "Fibres premium texture 3C/4A",
    length: "30 cm",
    price: 520,
    inStock: true,
    image: wig2,
    highlights: ["Éligible Sécu", "Texture afro", "Monture hypoallergénique"],
    medical: {
      color: "Noir naturel",
      colorFamily: "Noir",
      style: "Bouclée",
      cap: "Monture hypoallergénique stretch (tailles S/M/L)",
      density: "Dense",
      faceShapes: ["Ovale", "Carré", "Long"],
      bestFor: [
        "Texture afro 3C/4A préservée",
        "Volume immédiat sans coiffage quotidien",
      ],
      included: [
        "Essayage privé d'1h",
        "Démêlage & shaping personnalisé",
        "Pose offerte",
        "Tiers payant Sécu",
      ],
      care: [
        "Hydratation hebdomadaire (spray leave-in)",
        "Bonnet satin la nuit recommandé",
        "Pas de fer chaud > 150 °C",
      ],
    },
  },
  {
    slug: "perruque-medicale-courte-carre",
    name: "Perruque médicale — Carré court",
    category: "Perruques médicales",
    shortDescription: "Carré lisse intemporel, léger et discret.",
    description:
      "Perruque médicale carré court en cheveux naturels, monture lace front pour une ligne de front naturelle. Idéale pour un porter quotidien léger et facile à entretenir.",
    hairType: "Cheveux naturels Remy",
    length: "25 cm",
    price: 590,
    inStock: true,
    image: wig1,
    highlights: ["Éligible Sécu", "Lace front", "Léger", "Entretien facile"],
    medical: {
      color: "Brun chocolat",
      colorFamily: "Brun",
      style: "Lisse",
      cap: "Lace front + monture ultra-légère (< 90 g)",
      density: "Légère",
      faceShapes: ["Ovale", "Cœur", "Long"],
      bestFor: [
        "Port quotidien actif (travail, sport doux)",
        "Climat chaud, recherche de légèreté",
      ],
      included: [
        "Essayage privé d'1h",
        "Coupe personnalisée",
        "Pose offerte",
        "Tiers payant Sécu",
      ],
      care: [
        "Brushing facile à la brosse plate",
        "Lavage tous les 12 à 15 ports",
        "Spray thermo-protecteur si fer < 160 °C",
      ],
    },
  },
  {
    slug: "perruque-medicale-longue-frange",
    name: "Perruque médicale — Longue avec frange",
    category: "Perruques médicales",
    shortDescription: "Longueur féminine, frange dégradée naturelle.",
    description:
      "Perruque médicale longue avec frange, cheveux naturels Remy, monture confort respirante. Coupe dégradée moderne pour un rendu très naturel au quotidien.",
    hairType: "Cheveux naturels Remy",
    length: "45 cm",
    price: 750,
    inStock: true,
    image: wig2,
    highlights: ["Éligible Sécu", "Frange dégradée", "Monture respirante", "Pose offerte"],
    medical: {
      color: "Brun foncé reflets cuivrés",
      colorFamily: "Brun",
      style: "Lisse",
      cap: "Monture confort respirante, raie multidirectionnelle",
      density: "Moyenne",
      faceShapes: ["Ovale", "Carré", "Cœur"],
      bestFor: [
        "Envie de longueur et de féminité",
        "Camoufler une ligne de front fragilisée",
      ],
      included: [
        "Essayage privé d'1h",
        "Ajustement de la frange",
        "Pose offerte",
        "Tiers payant Sécu",
      ],
      care: [
        "Démêlage quotidien doux à la brosse Wet",
        "Masque nourrissant 1× / semaine",
        "Tresser la nuit pour préserver les pointes",
      ],
    },
  },
  {
    slug: "perruque-medicale-chatain-miel",
    name: "Perruque médicale — Châtain miel mi-longue",
    category: "Perruques médicales",
    shortDescription: "Coloration châtain miel lumineuse, mi-longue.",
    description:
      "Perruque médicale mi-longue, fibres premium coloration châtain miel avec reflets dorés. Monture hypoallergénique, idéale pour un rendu chaleureux et lumineux.",
    hairType: "Fibres premium",
    length: "35 cm",
    price: 560,
    inStock: true,
    image: wig1,
    highlights: ["Éligible Sécu", "Reflets dorés", "Monture hypoallergénique"],
    medical: {
      color: "Châtain miel reflets dorés",
      colorFamily: "Blond",
      style: "Ondulée",
      cap: "Monture hypoallergénique stretch",
      density: "Moyenne",
      faceShapes: ["Ovale", "Rond", "Cœur"],
      bestFor: [
        "Carnation chaude, envie de lumière",
        "Look naturel sans entretien colorimétrique",
      ],
      included: [
        "Essayage privé d'1h",
        "Conseil colorimétrie",
        "Pose offerte",
        "Tiers payant Sécu",
      ],
      care: [
        "Pas de coloration sur fibre synthétique",
        "Brossage doux après chaque port",
        "Spray démêlant spécifique fibres",
      ],
    },
  },
  {
    slug: "extensions-wavy-bundles",
    name: "Extensions wavy — Lot 3 bundles",
    category: "Extensions",
    shortDescription: "Cheveux 100% naturels, ondulation douce.",
    description:
      "Lot de 3 bundles de cheveux 100% naturels, ondulation wavy, pour un tissage volumineux et soyeux. Disponible en plusieurs longueurs sur demande.",
    hairType: "100% cheveux naturels",
    length: "40 / 45 / 50 cm",
    price: 240,
    inStock: true,
    image: extensions,
    highlights: ["3 bundles", "Réutilisable", "Coloration possible"],
  },
  {
    slug: "extensions-straight-bundles",
    name: "Extensions lisses — Lot 3 bundles",
    category: "Extensions",
    shortDescription: "Lisse soyeux, idéal pour tissage cousu.",
    description:
      "Bundles lisses brillants, parfaits pour un rendu sleek. Densité régulière et trame solide.",
    hairType: "100% cheveux naturels",
    length: "40 / 45 / 50 cm",
    price: 230,
    inStock: false,
    image: extensions,
    highlights: ["3 bundles", "Trame renforcée"],
  },
  {
    slug: "soin-huile-fortifiante",
    name: "Huile fortifiante cuir chevelu",
    category: "Soins",
    shortDescription: "Ricin, romarin, jojoba — pour favoriser la pousse.",
    description:
      "Sérum capillaire formulé à base d'huile de ricin, romarin et jojoba. À appliquer 2 à 3 fois par semaine en massage du cuir chevelu.",
    hairType: "Tous types",
    length: "100 ml",
    price: 24,
    inStock: true,
    image: care,
    highlights: ["Naturel", "Made in France"],
  },
  {
    slug: "soin-masque-nourrissant",
    name: "Masque nourrissant intense",
    category: "Soins",
    shortDescription: "Beurre de karité & huile d'argan, hydratation profonde.",
    description:
      "Masque réparateur pour cheveux secs, abîmés ou tressés. Restaure souplesse et brillance dès la première application.",
    hairType: "Cheveux secs & abîmés",
    length: "250 ml",
    price: 32,
    inStock: true,
    image: care,
    highlights: ["Sans sulfates", "Karité bio"],
  },
];

export const getProductBySlug = (slug: string) =>
  products.find((p) => p.slug === slug);

export const getMedicalWigs = () =>
  products.filter((p) => p.category === "Perruques médicales");

export const productCategories = [
  "Toutes",
  "Perruques médicales",
  "Extensions",
  "Soins",
] as const;

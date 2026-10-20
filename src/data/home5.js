export const heroSlides = [
  {
    id: 1,
    bgColor: "#1c1c1c",
    videoSrc: "/assets/videos/video_1.mp4",
    posterSrc: "/assets/images/home/demo5/slider1.jpg",
    title: "Des pièces d’exception pour un style unique",
    ctaLabel: "Voir la boutique",
  },
  {
    id: 2,
    bgColor: "#1c1c1c",
    videoSrc: "/assets/videos/video_2.mp4",
    posterSrc: "/assets/images/home/demo5/slider2.jpg",
    title: "Nouveautés de saison, livrées en Tunisie",
    ctaLabel: "Découvrir",
  },
  {
    id: 3,
    bgColor: "#1c1c1c",
    videoSrc: "/assets/videos/video_3.mp4",
    posterSrc: "/assets/images/home/demo5/slider1.jpg",
    title: "L’élégance tunisienne, livrée chez vous",
    ctaLabel: "Explorer",
  },
];

const categoryList = [
  { name: "Sacs à main", imgSrc: "/assets/images/home/demo5/category_1.png" },
  { name: "Vêtements", imgSrc: "/assets/images/home/demo5/category_2.png" },
  { name: "Vestes", imgSrc: "/assets/images/home/demo5/category_3.png" },
  { name: "Montres", imgSrc: "/assets/images/home/demo5/category_4.png" },
  { name: "Robes", imgSrc: "/assets/images/home/demo5/category_5.png" },
  { name: "Chaussures", imgSrc: "/assets/images/home/demo5/category_6.png" },
  { name: "Jeans", imgSrc: "/assets/images/home/demo5/category_7.png" },
  { name: "Chemises", imgSrc: "/assets/images/home/demo5/category_8.png" },
];

// Listed twice so the looping carousel always has enough slides.
export const categories = [...categoryList, ...categoryList].map(
  (elm, i) => ({ id: i + 1, ...elm })
);

export const collectionFilters = ["En vedette", "Populaires", "Mieux notés"];

const collectionItems = [
  {
    imgSrc: "/assets/images/home/demo5/product-0-1.jpg",
    category: "Vestes",
    title: "Veste courte en simili cuir",
    price: 189,
  },
  {
    imgSrc: "/assets/images/home/demo5/product-1-1.jpg",
    category: "Pantalons",
    title: "Short Calvin",
    price: 79,
  },
  {
    imgSrc: "/assets/images/home/demo5/product-2-1.jpg",
    category: "T-shirts",
    title: "T-shirt Kirby",
    price: 49,
  },
  {
    imgSrc: "/assets/images/home/demo5/product-3-1.jpg",
    category: "Accessoires",
    title: "Châle en maille torsadée",
    priceOld: 159,
    price: 119,
  },
  {
    imgSrc: "/assets/images/home/demo5/product-4-1.jpg",
    category: "Chemises",
    title: "Chemise imprimé guépard",
    priceOld: 149,
    price: 109,
  },
];

export const topCollectionProducts = collectionFilters.flatMap(
  (filterCategory, filterIndex) =>
    [...collectionItems, ...collectionItems].map((elm, i) => ({
      id: 5001 + filterIndex * 10 + i,
      ...elm,
      filterCategory,
    }))
);

export const lookbookItems = [
  {
    id: 5101,
    imgSrc: "/assets/images/home/demo5/lookbook-1.jpg",
    category: "Collection Femme",
    title: "Robe fleurie",
  },
  {
    id: 5102,
    imgSrc: "/assets/images/home/demo5/lookbook-2.jpg",
    category: "Collection Femme",
    title: "Trench-coat",
  },
  {
    id: 5103,
    imgSrc: "/assets/images/home/demo5/lookbook-3.jpg",
    category: "Collection Homme",
    title: "Pantalon folk",
  },
  {
    id: 5104,
    imgSrc: "/assets/images/home/demo5/lookbook-4.jpg",
    category: "Collection Homme",
    title: "Veste COS",
  },
];

const bestSellerItems = [
  {
    imgSrc: "/assets/images/home/demo5/product-5-1.jpg",
    category: "Robes",
    title: "Robe midi plissée",
    price: 139,
  },
  {
    imgSrc: "/assets/images/home/demo5/product-6-1.jpg",
    category: "Pulls",
    title: "Pull col roulé en laine",
    price: 119,
  },
  {
    imgSrc: "/assets/images/home/demo5/product-7-1.jpg",
    category: "Chaussures",
    title: "Baskets en cuir blanc",
    price: 199,
  },
  {
    imgSrc: "/assets/images/home/demo5/product-8-1.jpg",
    category: "Sacs",
    title: "Sac cabas en cuir",
    priceOld: 299,
    price: 229,
  },
];

export const bestSellerProducts = [...bestSellerItems, ...bestSellerItems].map(
  (elm, i) => ({ id: 5201 + i, ...elm })
);

const weekDealItems = [
  {
    imgSrc: "/assets/images/home/demo5/product-10-1.jpg",
    title: "Veste courte en simili cuir",
    price: 129,
  },
  {
    imgSrc: "/assets/images/home/demo5/product-11-1.jpg",
    title: "Short Calvin",
    price: 59,
  },
  {
    imgSrc: "/assets/images/home/demo5/product-12-1.jpg",
    title: "T-shirt Kirby",
    price: 35,
  },
  {
    imgSrc: "/assets/images/home/demo5/product-13-1.jpg",
    title: "Châle en maille torsadée",
    price: 89,
  },
];

export const weekDealProducts = [...weekDealItems, ...weekDealItems].map(
  (elm, i) => ({ id: 5301 + i, imgAlt: elm.title, ...elm })
);

export const home5Products = [
  ...topCollectionProducts,
  ...bestSellerProducts,
  ...weekDealProducts,
];

export const blogPosts = [
  {
    id: 1,
    imgSrc: "/assets/images/home/demo2/post1.jpg",
    author: "Admin",
    date: "5 avril 2023",
    title: "Les tendances mode incontournables de la saison",
  },
  {
    id: 2,
    imgSrc: "/assets/images/home/demo2/post2.jpg",
    author: "Admin",
    date: "5 avril 2023",
    title: "Comment composer une garde-robe intemporelle",
  },
  {
    id: 3,
    imgSrc: "/assets/images/home/demo2/post3.jpg",
    author: "Admin",
    date: "5 avril 2023",
    title: "Nos conseils pour bien choisir vos chaussures",
  },
  {
    id: 4,
    imgSrc: "/assets/images/home/demo2/post2.jpg",
    author: "Admin",
    date: "5 avril 2023",
    title: "Comment composer une garde-robe intemporelle",
  },
];

export const servicePromotions = [
  {
    id: 1,
    icon: "#icon_shipping",
    title: "Livraison rapide et gratuite",
    content: "Livraison gratuite dès 300 TND d'achat",
  },
  {
    id: 2,
    icon: "#icon_headphone",
    title: "Service client 7j/7",
    content: "Une équipe à votre écoute 24h/24",
  },
  {
    id: 3,
    icon: "#icon_shield",
    title: "Satisfait ou remboursé",
    content: "Remboursement sous 30 jours",
  },
];

export const footerCompanyLinks = [
  { href: "/about", text: "À propos" },
  { href: "/contact", text: "Nous contacter" },
];

export const footerShopLinks = [
  { href: "/shop-1", text: "Toute la boutique" },
  { href: "/shop-2", text: "Nouveautés" },
  { href: "/shop_cart", text: "Panier" },
];

export const footerHelpLinks = [
  { href: "/shop_order_tracking", text: "Suivi de commande" },
  { href: "/contact", text: "Contact" },
  { href: "/about", text: "Livraison" },
];

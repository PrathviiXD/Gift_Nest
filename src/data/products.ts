export type Product = {
  id: string
  name: string
  price: number
  originalPrice?: number
  category: string
  subcategory?: string
  image: string
  rating: number
  reviewCount: number
  description: string
  tags: string[]
  inStock: boolean
  isNew?: boolean
  isFeatured?: boolean
  isBestseller?: boolean
  occasion?: string[]
  material?: string
  weight?: string
  dimensions?: string
}

export type Category = {
  id: string
  name: string
  icon: string
  count: number
  image: string
}

export const categories: Category[] = [
  { id: "home-decor", name: "Home Decor", icon: "🏠", count: 48, image: "/product-pottery.webp" },
  { id: "jewelry-boxes", name: "Jewelry & Boxes", icon: "💎", count: 32, image: "/product-jewelry-box.webp" },
  { id: "candles-fragrances", name: "Candles & Fragrances", icon: "🕯️", count: 24, image: "/product-candle.webp" },
  { id: "textiles", name: "Textiles & Scarves", icon: "🧣", count: 36, image: "/product-scarf.webp" },
  { id: "hampers", name: "Gift Hampers", icon: "🎁", count: 20, image: "/product-hamper.webp" },
  { id: "figurines", name: "Art & Figurines", icon: "🎨", count: 28, image: "/product-ganesha.webp" },
  { id: "stationery", name: "Stationery", icon: "📖", count: 16, image: "/product-journal.webp" },
  { id: "wellness", name: "Wellness", icon: "🌿", count: 22, image: "/product-candle.webp" },
]

export const products: Product[] = [
  {
    id: "p1",
    name: "Carved Mahogany Jewelry Box",
    price: 2499,
    originalPrice: 3299,
    category: "jewelry-boxes",
    image: "/product-jewelry-box.webp",
    rating: 4.8,
    reviewCount: 124,
    description: "Exquisitely handcrafted from premium mahogany wood with intricate floral carvings. Features a velvet-lined interior with multiple compartments for organizing jewelry.",
    tags: ["handcrafted", "wooden", "jewelry", "storage", "luxury"],
    inStock: true,
    isFeatured: true,
    isBestseller: true,
    occasion: ["birthday", "anniversary", "wedding"],
    material: "Mahogany Wood",
    weight: "800g",
    dimensions: "25 x 18 x 12 cm",
  },
  {
    id: "p2",
    name: "Lavender Soy Wax Candle",
    price: 899,
    category: "candles-fragrances",
    image: "/product-candle.webp",
    rating: 4.7,
    reviewCount: 89,
    description: "Hand-poured soy wax candle infused with pure lavender essential oils. Adorned with dried lavender buds for a rustic, charming aesthetic. Burns for up to 45 hours.",
    tags: ["candle", "lavender", "soy", "aromatherapy", "relaxation"],
    inStock: true,
    isNew: true,
    isFeatured: true,
    occasion: ["housewarming", "self-care", "birthday"],
    material: "Soy Wax",
    weight: "250g",
  },
  {
    id: "p3",
    name: "Block Print Silk Scarf",
    price: 1799,
    originalPrice: 2199,
    category: "textiles",
    image: "/product-scarf.webp",
    rating: 4.9,
    reviewCount: 67,
    description: "Luxurious pure silk scarf hand-block printed with traditional Indian motifs in stunning teal and gold. Each piece is unique, made by skilled artisans in Jaipur.",
    tags: ["silk", "block print", "Jaipur", "handmade", "traditional"],
    inStock: true,
    isFeatured: true,
    occasion: ["festival", "birthday", "anniversary"],
    material: "Pure Silk",
    dimensions: "180 x 70 cm",
  },
  {
    id: "p4",
    name: "Blue Pottery Vase",
    price: 1299,
    category: "home-decor",
    image: "/product-pottery.webp",
    rating: 4.6,
    reviewCount: 45,
    description: "Authentic Jaipur blue pottery vase with classic blue and white floral motifs. Each piece is individually handcrafted and hand-painted by master artisans.",
    tags: ["pottery", "Jaipur", "blue pottery", "handmade", "ceramic"],
    inStock: true,
    isFeatured: true,
    occasion: ["housewarming", "wedding"],
    material: "Ceramic",
    dimensions: "20 x 12 cm",
  },
  {
    id: "p5",
    name: "Festive Luxury Gift Hamper",
    price: 4999,
    originalPrice: 5999,
    category: "hampers",
    image: "/product-hamper.webp",
    rating: 4.9,
    reviewCount: 203,
    description: "A curated premium hamper featuring artisan chocolates, exotic teas, handmade cookies, and decorative items. Beautifully packaged for any celebration.",
    tags: ["hamper", "chocolates", "tea", "premium", "celebration"],
    inStock: true,
    isBestseller: true,
    isFeatured: true,
    occasion: ["diwali", "christmas", "corporate", "birthday"],
    weight: "2.5kg",
  },
  {
    id: "p6",
    name: "Brass Ganesha Figurine",
    price: 1899,
    category: "figurines",
    image: "/product-ganesha.webp",
    rating: 4.8,
    reviewCount: 156,
    description: "Intricately crafted brass Ganesha figurine with fine detailing and antique gold finish. A beautiful addition to home decor and an auspicious housewarming gift.",
    tags: ["brass", "Ganesha", "traditional", "religious", "decor"],
    inStock: true,
    isBestseller: true,
    occasion: ["housewarming", "diwali", "puja"],
    material: "Brass",
    weight: "600g",
    dimensions: "15 x 10 x 8 cm",
  },
  {
    id: "p7",
    name: "Mandala Embossed Leather Journal",
    price: 1199,
    category: "stationery",
    image: "/product-journal.webp",
    rating: 4.5,
    reviewCount: 78,
    description: "Premium genuine leather journal with a hand-embossed mandala on the cover. Contains 200 pages of acid-free cream paper with a satin ribbon bookmark.",
    tags: ["journal", "leather", "mandala", "writing", "stationery"],
    inStock: true,
    isNew: true,
    occasion: ["graduation", "birthday", "corporate"],
    material: "Genuine Leather",
    dimensions: "21 x 15 cm",
  },
  {
    id: "p8",
    name: "Rose & Sandalwood Diffuser Set",
    price: 2199,
    category: "wellness",
    image: "/product-candle.webp",
    rating: 4.7,
    reviewCount: 92,
    description: "Elegant reed diffuser set with handblown glass bottle and premium rose & sandalwood fragrance oil. Includes 8 natural rattan reeds for a lasting, sophisticated scent.",
    tags: ["diffuser", "aromatherapy", "rose", "sandalwood", "wellness"],
    inStock: true,
    occasion: ["housewarming", "self-care"],
    material: "Glass, Rattan",
  },
]

export const aiRecommendations = (occasion: string): Product[] => {
  return products.filter(p => p.occasion?.includes(occasion)).slice(0, 4)
}

export const getProductById = (id: string): Product | undefined =>
  products.find(p => p.id === id)

export const getProductsByCategory = (category: string): Product[] =>
  products.filter(p => p.category === category)

export const featuredProducts = products.filter(p => p.isFeatured)
export const bestsellerProducts = products.filter(p => p.isBestseller)
export const newArrivals = products.filter(p => p.isNew)

export const formatPrice = (price: number): string =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(price)

const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const productSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    comparePrice: Number,
    category: String,
    images: [{ url: String, alt: String }],
    sizes: [String],
    colors: [String],
    stock: Number,
    isFeatured: Boolean,
    tags: [String],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" },
  },
  { timestamps: true },
);

const bcrypt = require("bcryptjs");

const Product = mongoose.model("Product", productSchema);
const User = mongoose.model("User", userSchema);

const products = [
  {
    name: "Linen Relaxed Shirt",
    description: "Breathable linen shirt perfect for warm days.",
    price: 68,
    category: "Tops",
    images: [
      {
        url: "/linen-relaxed-shirt.jpg",
        alt: "Linen Shirt",
      },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Sand"],
    stock: 45,
    isFeatured: true,
    tags: ["summer", "linen"],
    rating: 4.8,
    numReviews: 24,
  },
  {
    name: "Wide Leg Trousers",
    description: "Tailored wide-leg trousers in fluid fabric.",
    price: 89,
    category: "Bottoms",
    images: [
      {
        url: "/wide-leg-trousers.jpg",
        alt: "Trousers",
      },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["Black", "Camel"],
    stock: 30,
    isFeatured: true,
    tags: ["tailored"],
    rating: 4.6,
    numReviews: 18,
  },
  {
    name: "Merino Crew Knit",
    description: "Ultrafine merino wool crew neck.",
    price: 120,
    category: "Tops",
    images: [
      {
        url: "/merino-crew-knit.jpg",
        alt: "Knit",
      },
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Oatmeal", "Navy"],
    stock: 20,
    isFeatured: true,
    tags: ["knitwear"],
    rating: 4.9,
    numReviews: 42,
  },
  {
    name: "Oversized Blazer",
    description: "Unstructured blazer with oversized silhouette.",
    price: 195,
    comparePrice: 260,
    category: "Outerwear",
    images: [
      {
        url: "/oversized-blazer.jpg",
        alt: "Blazer",
      },
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Chalk", "Charcoal"],
    stock: 15,
    isFeatured: true,
    tags: ["blazer", "sale"],
    rating: 4.7,
    numReviews: 31,
  },
  {
    name: "Satin Slip Skirt",
    description: "Midi-length satin skirt that catches light beautifully.",
    price: 72,
    category: "Bottoms",
    images: [
      {
        url: "/satin-slip-skirt.jpg",
        alt: "Skirt",
      },
    ],
    sizes: ["XS", "S", "M", "L"],
    colors: ["Champagne", "Blush"],
    stock: 22,
    isFeatured: false,
    tags: ["skirt", "evening"],
    rating: 4.5,
    numReviews: 16,
  },
  {
    name: "Canvas Tote Bag",
    description: "Heavy-duty canvas with leather handles.",
    price: 38,
    comparePrice: 55,
    category: "Accessories",
    images: [
      {
        url: "/tote-bag.jpg",
        alt: "Tote",
      },
    ],
    sizes: ["One Size"],
    colors: ["Natural", "Black"],
    stock: 60,
    isFeatured: false,
    tags: ["bag", "sale"],
    rating: 4.4,
    numReviews: 58,
  },
  {
    name: "Puffer Vest",
    description: "Lightweight down-fill vest for layering.",
    price: 115,
    category: "Outerwear",
    images: [
      {
        url: "/puffer-vest.jpg",
        alt: "Vest",
      },
    ],
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Cream"],
    stock: 18,
    isFeatured: false,
    tags: ["vest", "winter"],
    rating: 4.6,
    numReviews: 22,
  },
  {
    name: "Ribbed Tank Top",
    description: "Fine-ribbed cotton tank, a wardrobe staple.",
    price: 32,
    category: "Tops",
    images: [
      {
        url: "/ribbed-tank-top.jpg",
        alt: "Tank",
      },
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
    colors: ["White", "Black", "Grey"],
    stock: 80,
    isFeatured: false,
    tags: ["basics", "summer"],
    rating: 4.7,
    numReviews: 95,
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB...");

    await Product.deleteMany();
    await User.deleteMany();
    console.log("Cleared old data");

    await Product.insertMany(products);
    console.log(`Seeded ${products.length} products`);

    const hashedAdmin = await bcrypt.hash("admin123", 12);
    const hashedUser = await bcrypt.hash("test123", 12);

    await User.create([
      {
        name: "Admin User",
        email: "admin@velour.com",
        password: hashedAdmin,
        role: "admin",
      },
      {
        name: "Jane Doe",
        email: "jane@example.com",
        password: hashedUser,
        role: "user",
      },
    ]);

    console.log("Created admin:     admin@velour.com / admin123");
    console.log("Created test user: jane@example.com / test123");
    console.log("Seed complete!");
    process.exit(0);
  } catch (err) {
    console.error("Seed error:", err.message);
    process.exit(1);
  }
};

seed();

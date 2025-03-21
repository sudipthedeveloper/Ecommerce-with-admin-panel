import mongoose from "mongoose";
import ProductModel from "./models/product.model.js";
import SubCategoryModel from "./models/subCategory.model.js";
import CategoryModel from "./models/category.model.js"; // Assuming you have this model

// Connect to MongoDB
mongoose.connect('mongodb+srv://berasaikat729:TXwBXqC1mEDut7DP@cluster0.vrpud.mongodb.net', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Could not connect to MongoDB', err));

// Sample categories data
const categories = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Furniture",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Decor",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Lighting",
    image: "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Textiles",
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Kitchen & Dining",
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
  }
];

// Sample sub-categories data
const subCategories = [
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Sofas & Couches",
    image: "https://images.unsplash.com/photo-1540574163026-643ea20ade25?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: [categories[0]._id]
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Tables",
    image: "https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: [categories[0]._id]
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Wall Art",
    image: "https://images.unsplash.com/photo-1531266752426-aad472b7bbf4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: [categories[1]._id]
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Vases & Vessels",
    image: "https://images.unsplash.com/photo-1612196808214-75c48677a30c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: [categories[1]._id]
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Floor Lamps",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: [categories[2]._id]
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Table Lamps",
    image: "https://images.unsplash.com/photo-1490197415175-074fd86b1fcc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: [categories[2]._id]
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Throw Pillows",
    image: "https://images.unsplash.com/photo-1589696709339-31bdb3c99f0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: [categories[3]._id]
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Blankets & Throws",
    image: "https://images.unsplash.com/photo-1584346133934-a3ceb4e68959?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: [categories[3]._id]
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Dinnerware",
    image: "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: [categories[4]._id]
  },
  {
    _id: new mongoose.Types.ObjectId(),
    name: "Serveware",
    image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
    category: [categories[4]._id]
  }
];

// Sample products data
const products = [
  {
    name: "Modern Velvet Sofa",
    image: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1558211583-d26f610c1eb1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    ],
    category: [categories[0]._id],
    subCategory: [subCategories[0]._id],
    unit: "piece",
    stock: 15,
    price: 899.99,
    discount: 10,
    description: "Elegant velvet sofa with wooden legs, perfect for modern living rooms. Features plush cushions and durable frame.",
    more_details: {
      dimensions: "84\" W x 36\" D x 32\" H",
      material: "Velvet, Wood",
      color: "Navy Blue",
      assembly: "Minimal assembly required",
      warranty: "2 year limited warranty"
    },
    publish: true
  },
  {
    name: "Marble Coffee Table",
    image: [
      "https://images.unsplash.com/photo-1577140917170-285929fb55b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1567016376408-0226e4d0c1ea?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    ],
    category: [categories[0]._id],
    subCategory: [subCategories[1]._id],
    unit: "piece",
    stock: 20,
    price: 349.99,
    discount: 0,
    description: "Stylish coffee table with genuine marble top and gold-finished steel legs. Adds elegance to any living space.",
    more_details: {
      dimensions: "42\" W x 24\" D x 18\" H",
      material: "Marble, Steel",
      color: "White/Gold",
      assembly: "Assembly required",
      weight: "45 lbs"
    },
    publish: true
  },
  {
    name: "Abstract Canvas Wall Art",
    image: [
      "https://images.unsplash.com/photo-1531266752426-aad472b7bbf4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    ],
    category: [categories[1]._id],
    subCategory: [subCategories[2]._id],
    unit: "piece",
    stock: 25,
    price: 129.99,
    discount: 15,
    description: "Contemporary abstract canvas print with vibrant colors. Hand-stretched on solid wood frame with hanging hardware included.",
    more_details: {
      dimensions: "36\" W x 24\" H x 1.5\" D",
      material: "Canvas, Wood",
      style: "Abstract",
      artist: "Emma Reynolds",
      care: "Dust with soft, dry cloth"
    },
    publish: true
  },
  {
    name: "Handcrafted Ceramic Vase",
    image: [
      "https://images.unsplash.com/photo-1612196808214-75c48677a30c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1578500494198-246f612d3b3d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    ],
    category: [categories[1]._id],
    subCategory: [subCategories[3]._id],
    unit: "piece",
    stock: 30,
    price: 79.99,
    discount: 0,
    description: "Artisan-crafted ceramic vase with unique glazed finish. Each piece has slight variations making it one-of-a-kind.",
    more_details: {
      dimensions: "8\" diameter x 12\" H",
      material: "Ceramic",
      color: "Teal/Copper",
      care: "Hand wash only",
      waterproof: true
    },
    publish: true
  },
  {
    name: "Adjustable Brass Floor Lamp",
    image: [
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1534126874-5f6762c6f8be?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    ],
    category: [categories[2]._id],
    subCategory: [subCategories[4]._id],
    unit: "piece",
    stock: 12,
    price: 199.99,
    discount: 5,
    description: "Modern brass floor lamp with adjustable arm and shade. Features foot dimmer switch for customizable lighting.",
    more_details: {
      dimensions: "66\" H x 22\" W (extended)",
      material: "Brass, Linen",
      bulb: "E26 socket, max 60W (not included)",
      cord_length: "8 feet",
      switch_type: "Foot dimmer"
    },
    publish: true
  },
  {
    name: "Ceramic Table Lamp with Linen Shade",
    image: [
      "https://images.unsplash.com/photo-1490197415175-074fd86b1fcc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    ],
    category: [categories[2]._id],
    subCategory: [subCategories[5]._id],
    unit: "piece",
    stock: 18,
    price: 149.99,
    discount: 0,
    description: "Elegant ceramic table lamp with textured base and natural linen shade. Perfect for bedside tables or living room.",
    more_details: {
      dimensions: "15\" diameter x 24\" H",
      material: "Ceramic, Linen",
      color: "White/Natural",
      bulb: "E26 socket, max 75W (not included)",
      switch_type: "In-line"
    },
    publish: true
  },
  {
    name: "Luxury Velvet Throw Pillows Set",
    image: [
      "https://images.unsplash.com/photo-1589696709339-31bdb3c99f0c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1558997519-83ea9252edf8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1540730930991-a9286a5f5150?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    ],
    category: [categories[3]._id],
    subCategory: [subCategories[6]._id],
    unit: "set",
    stock: 40,
    price: 69.99,
    discount: 20,
    description: "Set of 2 luxurious velvet throw pillows with hidden zipper. Plush filling for comfort and decorative appeal.",
    more_details: {
      dimensions: "18\" x 18\" each",
      material: "Velvet, Polyester filling",
      colors: "Emerald Green",
      care: "Removable covers, machine washable",
      includes: "2 pillow covers, 2 inserts"
    },
    publish: true
  },
  {
    name: "Chunky Knit Throw Blanket",
    image: [
      "https://images.unsplash.com/photo-1584346133934-a3ceb4e68959?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1605774337664-7a846e9cdf17?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    ],
    category: [categories[3]._id],
    subCategory: [subCategories[7]._id],
    unit: "piece",
    stock: 35,
    price: 129.99,
    discount: 0,
    description: "Handcrafted chunky knit throw blanket made from premium cotton yarn. Adds texture and warmth to any space.",
    more_details: {
      dimensions: "50\" x 60\"",
      material: "100% Cotton",
      color: "Ivory",
      care: "Hand wash cold, lay flat to dry",
      weight: "4 lbs"
    },
    publish: true
  },
  {
    name: "Porcelain Dinner Plate Set",
    image: [
      "https://images.unsplash.com/photo-1603199506016-b9a594b593c0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1587317996237-52670907b551?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    ],
    category: [categories[4]._id],
    subCategory: [subCategories[8]._id],
    unit: "set",
    stock: 25,
    price: 89.99,
    discount: 10,
    description: "Set of 4 elegant porcelain dinner plates with matte finish and subtle organic shape. Microwave and dishwasher safe.",
    more_details: {
      dimensions: "10.5\" diameter each",
      material: "Fine Porcelain",
      color: "White",
      care: "Dishwasher and microwave safe",
      includes: "4 dinner plates"
    },
    publish: true
  },
  {
    name: "Acacia Wood Serving Board",
    image: [
      "https://images.unsplash.com/photo-1610701596007-11502861dcfa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1606312619370-d48b47335d56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80",
      "https://images.unsplash.com/photo-1541528069931-35b789a896bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
    ],
    category: [categories[4]._id],
    subCategory: [subCategories[9]._id],
    unit: "piece",
    stock: 30,
    price: 59.99,
    discount: 0,
    description: "Beautiful acacia wood serving board with handle. Perfect for charcuterie, cheese, or as a decorative accent.",
    more_details: {
      dimensions: "18\" L x 8\" W x 0.75\" H",
      material: "Acacia Wood",
      finish: "Food-safe oil",
      care: "Hand wash only, re-oil occasionally",
      sustainably_sourced: true
    },
    publish: true
  }
];

// Function to seed the database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await CategoryModel.deleteMany({});
    await SubCategoryModel.deleteMany({});
    await ProductModel.deleteMany({});
    
    // Insert categories
    await CategoryModel.insertMany(categories);
    console.log('Categories seeded successfully');
    
    // Insert sub-categories
    await SubCategoryModel.insertMany(subCategories);
    console.log('Sub-categories seeded successfully');
    
    // Insert products
    await ProductModel.insertMany(products);
    console.log('Products seeded successfully');
    
    console.log('Database seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding database:', error);
    mongoose.connection.close();
  }
};

// Run the seed function
seedDatabase();
import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { Admin } from "../models/Admin.js";
import { Property } from "../models/Property.js";
import { Project } from "../models/Project.js";

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set");
  process.exit(1);
}

const SAMPLE_IMAGES = {
  p1: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
  p2: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80",
  p3: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  p4: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
  p5: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
  pr1: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c0b?w=800&q=80",
  pr2: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
  pr3: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80",
};

async function seed() {
  await mongoose.connect(uri);

  const username = process.env.ADMIN_USERNAME;
  const password = process.env.ADMIN_PASSWORD;

  let admin = await Admin.findOne({ username }).exec();
  if (!admin) {
    const passwordHash = await bcrypt.hash(password, 10);
    admin = await Admin.create({ username, passwordHash });
    console.log(`Created admin user: ${username}`);
  } else {
    console.log(`Admin user already exists: ${username}`);
  }

  const propCount = await Property.countDocuments();
  if (propCount === 0) {
    await Property.insertMany([
      {
        title: "Skyline Penthouse",
        price: "₹3.5 Cr",
        location: "Bandra West, Mumbai",
        type: "Buy",
        propertyType: "Apartment",
        bedrooms: 4,
        bathrooms: 3,
        area: "2,800 sq.ft",
        image: SAMPLE_IMAGES.p1,
        featured: true,
      },
      {
        title: "Heritage Row Villa",
        price: "₹85,000/mo",
        location: "Koregaon Park, Pune",
        type: "Rent",
        propertyType: "Villa",
        bedrooms: 5,
        bathrooms: 4,
        area: "4,200 sq.ft",
        image: SAMPLE_IMAGES.p2,
        featured: true,
      },
      {
        title: "Metro Business Hub",
        price: "₹1.2 Cr",
        location: "BKC, Mumbai",
        type: "Lease",
        propertyType: "Commercial",
        bedrooms: 0,
        bathrooms: 2,
        area: "3,500 sq.ft",
        image: SAMPLE_IMAGES.p3,
        featured: true,
      },
    ]);
    console.log("Seeded sample properties");
  } else {
    console.log("Properties collection not empty, skipping property seed");
  }

  const projCount = await Project.countDocuments();
  if (projCount === 0) {
    await Project.insertMany([
      {
        title: "Brickstone Skyline Tower",
        location: "Worli, Mumbai",
        status: "Ongoing",
        type: "Residential",
        description:
          "A 45-storey luxury residential tower offering panoramic sea views and world-class amenities.",
        highlights: [
          "45 Floors",
          "Sea-facing units",
          "Rooftop infinity pool",
          "Smart home integration",
        ],
        image: SAMPLE_IMAGES.pr1,
      },
      {
        title: "Brickstone Green Villas",
        location: "Lonavala, Maharashtra",
        status: "Completed",
        type: "Residential",
        description:
          "An exclusive gated community of premium villas nestled in the hills.",
        highlights: [
          "28 Villas",
          "Gated community",
          "Private gardens",
          "Clubhouse & spa",
        ],
        image: SAMPLE_IMAGES.pr2,
      },
      {
        title: "Brickstone Commerce Plaza",
        location: "Navi Mumbai",
        status: "Ongoing",
        type: "Commercial",
        description:
          "A modern commercial complex with Grade-A office spaces and retail outlets.",
        highlights: [
          "Grade-A offices",
          "Retail spaces",
          "Multi-level parking",
          "LEED certified",
        ],
        image: SAMPLE_IMAGES.pr3,
      },
    ]);
    console.log("Seeded sample projects");
  } else {
    console.log("Projects collection not empty, skipping project seed");
  }

  await mongoose.disconnect();
  console.log("Seed completed");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

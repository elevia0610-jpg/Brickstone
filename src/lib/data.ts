import property1 from "@/assets/property-1.jpg";
import property2 from "@/assets/property-2.jpg";
import property3 from "@/assets/property-3.jpg";
import property4 from "@/assets/property-4.jpg";
import property5 from "@/assets/property-5.jpg";
import project1 from "@/assets/project-1.jpg";
import project2 from "@/assets/project-2.jpg";
import project3 from "@/assets/project-3.jpg";

export type Property = {
  id: string;
  title: string;
  price: string;
  location: string;
  type: "Buy" | "Rent" | "Lease";
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  /** Backwards-compatible single image */
  image?: string;
  /** Preferred: multiple images */
  images?: string[];
  /** Optional video url */
  video?: string;
  featured?: boolean;
  description: string;
  highlights: string[];
};

export type Project = {
  id: string;
  title: string;
  location: string;
  status: "Ongoing" | "Completed";
  type: string;
  description: string;
  highlights: string[];
  image?: string;
  images?: string[];
  video?: string;
};

export const properties: Property[] = [
  {
    id: "1",
    title: "Skyline Penthouse",
    price: "₹3.5 Cr",
    location: "Bandra West, Mumbai",
    type: "Buy",
    propertyType: "Apartment",
    bedrooms: 4,
    bathrooms: 3,
    area: "2,800 sq.ft",
    image: property1,
    images: [property1],
    featured: true,
    description:
      "Experience the epitome of luxury living in our Skyline Penthouse, boasting breathtaking city views, state-of-the-art amenities, and exquisite interiors designed for the discerning homeowner.",
    highlights: [
      "Panoramic city views",
      "Private rooftop terrace",
    ],
  },
  {
    id: "2",
    title: "Heritage Row Villa",
    price: "₹85,000/mo",
    location: "Koregaon Park, Pune",
    type: "Rent",
    propertyType: "Villa",
    bedrooms: 5,
    bathrooms: 4,
    area: "4,200 sq.ft",
    image: property2,
    images: [property2],
    featured: true,
    description:
      "Step into timeless elegance with our Heritage Row Villa, a beautifully restored property that combines classic architecture with modern comforts, nestled in the heart of Koregaon Park.",
    highlights: [
      "Restored heritage architecture",
      "Spacious garden and pool",
    ],
  },
  {
    id: "3",
    title: "Metro Business Hub",
    price: "₹1.2 Cr",
    location: "BKC, Mumbai",
    type: "Lease",
    propertyType: "Commercial",
    bedrooms: 0,
    bathrooms: 2,
    area: "3,500 sq.ft",
    image: property3,
    images: [property3],
    featured: true,
    description:
      "Elevate your business presence with our Metro Business Hub, a premium commercial space located in the bustling BKC area, offering modern design, high foot traffic, and unparalleled connectivity.",
    highlights: [
      "Prime BKC location",
      "Modern office design",
    ],  
  },
];

export const projects: Project[] = [
  {
    id: "1",
    title: "Brickstone Skyline Tower",
    location: "Worli, Mumbai",
    status: "Ongoing",
    type: "Residential",
    description:
      "A 45-storey luxury residential tower offering panoramic sea views, world-class amenities, and intelligent home automation in every unit.",
    highlights: [
      "45 Floors",
      "Sea-facing units",
      "Rooftop infinity pool",
      "Smart home integration",
    ],
    image: project1,
    images: [project1],
  },
  {
    id: "2",
    title: "Brickstone Green Villas",
    location: "Lonavala, Maharashtra",
    status: "Completed",
    type: "Residential",
    description:
      "An exclusive gated community of 28 premium villas nestled in the hills, featuring private gardens, a clubhouse, and 24/7 concierge service.",
    highlights: [
      "28 Villas",
      "Gated community",
      "Private gardens",
      "Clubhouse & spa",
    ],
    image: project2,
    images: [project2],
  },
  {
    id: "3",
    title: "Brickstone Commerce Plaza",
    location: "Navi Mumbai",
    status: "Ongoing",
    type: "Commercial",
    description:
      "A modern commercial complex with Grade-A office spaces, retail outlets, and a grand lobby designed for premier businesses.",
    highlights: [
      "Grade-A offices",
      "Retail spaces",
      "Multi-level parking",
      "LEED certified",
    ],
    image: project3,
    images: [project3],
  },
];

export const testimonials = [
  {
    name: "Rajesh Sharma",
    role: "Homeowner",
    text: "Brickstone Real Estate made finding our dream home effortless. Their professionalism and attention to detail is unmatched.",
  },
  {
    name: "Priya Mehta",
    role: "Investor",
    text: "I've invested in multiple Brickstone projects. The returns and build quality have consistently exceeded expectations.",
  },
  {
    name: "Vikram Patel",
    role: "Business Owner",
    text: "Leasing our office through Brickstone was seamless. They understood our needs perfectly and delivered beyond our requirements.",
  },
];

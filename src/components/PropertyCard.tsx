import { motion } from "framer-motion";
import { MapPin, BedDouble, Bath, Maximize } from "lucide-react";
import { Link } from "react-router-dom";
import type { Property } from "@/lib/data";

const PropertyCard = ({
  property,
  onSelect,
}: {
  property: Property;
  onSelect?: (p: Property) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
    className="group bg-card rounded-3xl shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden"
    role={onSelect ? "button" : undefined}
    tabIndex={onSelect ? 0 : undefined}
    onClick={() => onSelect?.(property)}
    onKeyDown={(e) => {
      if (!onSelect) return;
      if (e.key === "Enter" || e.key === " ") onSelect(property);
    }}
  >
    <div className="p-2">
      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
        <img
          src={(property.images && property.images[0]) || property.image || ""}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-lg">
          {property.type}
        </span>
      </div>
    </div>
    <div className="px-5 pb-5 pt-2">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-serif text-xl tracking-tight text-foreground">
          {property.title}
        </h3>
        <span className="text-lg font-semibold text-primary tabular-nums whitespace-nowrap">
          {property.price}
        </span>
      </div>
      <p className="text-sm text-muted-foreground flex items-center gap-1 mb-4">
        <MapPin className="w-3.5 h-3.5" /> {property.location}
      </p>
      <div className="flex items-center gap-4 text-xs text-muted-foreground border-t border-border pt-3">
        {property.bedrooms > 0 && (
          <span className="flex items-center gap-1">
            <BedDouble className="w-3.5 h-3.5" /> {property.bedrooms} Beds
          </span>
        )}
        <span className="flex items-center gap-1">
          <Bath className="w-3.5 h-3.5" /> {property.bathrooms} Baths
        </span>
        <span className="flex items-center gap-1">
          <Maximize className="w-3.5 h-3.5" /> {property.area}
        </span>
      </div>
      <Link
        to="/contact"
        className="mt-4 block text-center bg-primary text-primary-foreground py-2.5 rounded-xl text-sm font-semibold hover:scale-[1.02] transition-transform duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        Inquire Now
      </Link>
    </div>
  </motion.div>
);

export default PropertyCard;

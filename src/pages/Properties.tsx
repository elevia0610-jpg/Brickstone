import { useState } from "react";
import { useResolvedProperties } from "@/hooks/usePublicListings";
import PropertyCard from "@/components/PropertyCard";
import SectionReveal from "@/components/SectionReveal";

const types = ["All", "Buy", "Rent", "Lease"] as const;
const propertyTypes = ["All", "Apartment", "Villa", "Commercial"] as const;

const Properties = () => {
  const [activeType, setActiveType] = useState<string>("All");
  const [activePropType, setActivePropType] = useState<string>("All");
  const { properties, isLoading, usingFallback } = useResolvedProperties();

  const filtered = properties.filter((p) => {
    if (activeType !== "All" && p.type !== activeType) return false;
    if (activePropType !== "All" && p.propertyType !== activePropType)
      return false;
    return true;
  });

  return (
    <main className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <SectionReveal>
          <span className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Browse
          </span>
          <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-foreground mt-2 mb-8">
            Properties
          </h1>

          {/* Filters */}
          <div className="flex flex-wrap gap-6 mb-12">
            <div className="flex bg-muted rounded-2xl p-1">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setActiveType(t)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeType === t
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <div className="flex bg-muted rounded-2xl p-1">
              {propertyTypes.map((t) => (
                <button
                  key={t}
                  onClick={() => setActivePropType(t)}
                  className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activePropType === t
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </SectionReveal>

        {usingFallback && (
          <p className="text-xs text-muted-foreground mb-6">
            Showing bundled listings (API unavailable).
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading && properties.length === 0 ? (
            <p className="text-muted-foreground col-span-full">Loading…</p>
          ) : (
            filtered.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))
          )}
        </div>

        {!isLoading && filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-16">
            No properties match your filters.
          </p>
        )}
      </div>
    </main>
  );
};

export default Properties;

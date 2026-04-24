import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useResolvedProperties } from "@/hooks/usePublicListings";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

import PropertyCard from "@/components/PropertyCard";
import SectionReveal from "@/components/SectionReveal";
import DetailsModal from "@/components/DetailsModal";
import type { Property } from "@/lib/data";

const types = ["All", "Buy", "Rent", "Lease"] as const;

const Properties = () => {
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<string>("All");
  const [activePropType, setActivePropType] = useState<string>("All");

  const { properties, isLoading, usingFallback } = useResolvedProperties();
  const [selected, setSelected] = useState<Property | null>(null);

  // ✅ Sync URL → state
  useEffect(() => {
    const params = new URLSearchParams(location.search);

    const q = params.get("q")?.toLowerCase() || "";
    const type = params.get("type");

    setSearchQuery(q);

    if (type) {
      setActiveType(type);
    } else {
      setActiveType("All");
    }
  }, [location.search]);

  // ✅ Fetch property types safely
  const {
    data: propertyTypesData = [],
    isLoading: typesLoading,
  } = useQuery({
    queryKey: ["propertyTypes"],
    queryFn: async () => {
      const res = await api.get("/api/property-types");

      if (Array.isArray(res.data)) return res.data;
      if (Array.isArray(res.data?.data)) return res.data.data;

      return [];
    },
  });

  const safePropertyTypes = Array.isArray(propertyTypesData)
    ? propertyTypesData
    : [];

  const propertyTypes = [
    "All",
    ...safePropertyTypes.map((t: any) => t.name),
  ];

  // ✅ FINAL FILTER LOGIC
  const filtered = properties.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery) ||
      p.location.toLowerCase().includes(searchQuery) ||
      p.propertyType.toLowerCase().includes(searchQuery);

    const matchesType =
      activeType === "All" || p.type === activeType;

    const matchesPropType =
      activePropType === "All" || p.propertyType === activePropType;

    return matchesSearch && matchesType && matchesPropType;
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

            {/* TYPE FILTER */}
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

            {/* PROPERTY TYPE FILTER */}
            <div className="flex bg-muted rounded-2xl p-1">
              {typesLoading ? (
                <span className="px-5 py-2 text-sm text-muted-foreground">
                  Loading...
                </span>
              ) : propertyTypes.length === 1 ? (
                <span className="px-5 py-2 text-sm text-muted-foreground">
                  No types available
                </span>
              ) : (
                propertyTypes.map((t) => (
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
                ))
              )}
            </div>
          </div>
        </SectionReveal>

        {/* FALLBACK INFO */}
        {usingFallback && (
          <p className="text-xs text-muted-foreground mb-6">
            Showing bundled listings (API unavailable).
          </p>
        )}

        {/* PROPERTY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading && properties.length === 0 ? (
            <p className="text-muted-foreground col-span-full">Loading…</p>
          ) : (
            filtered.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={(p) => setSelected(p)}
              />
            ))
          )}
        </div>

        {/* EMPTY STATE */}
        {!isLoading && filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-16">
            No properties match your search.
          </p>
        )}
      </div>

      {/* MODAL */}
      <DetailsModal
        open={!!selected}
        onClose={() => setSelected(null)}
        kind="property"
        item={selected}
      />
    </main>
  );
};

export default Properties;
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, Shield, Award, Clock, ChevronRight, Quote } from "lucide-react";
import heroImage from "@/assets/hero-property.jpg";
import { testimonials } from "@/lib/data";
import {
  useResolvedProperties,
  useResolvedProjects,
} from "@/hooks/usePublicListings";
import PropertyCard from "@/components/PropertyCard";
import SectionReveal from "@/components/SectionReveal";
import DetailsModal from "@/components/DetailsModal";
import type { Property, Project } from "@/lib/data";

const tabs = ["Buy", "Rent", "Lease"] as const;

const Index = () => {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]>("Buy");
  const { properties, isLoading, usingFallback } = useResolvedProperties();
  const { projects: projectList, isLoading: projectsLoading } =
    useResolvedProjects();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const featuredProperties = properties.filter((p) => p.featured);
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <main>
      {/* Hero */}
      <section className="relative h-[90vh] min-h-[600px] flex items-end">
        <img
          src={heroImage}
          alt="Luxury villa exterior"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-32 w-full">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-serif text-5xl md:text-7xl tracking-tight text-primary-foreground max-w-2xl"
          >
            Architectural Excellence, Curated for You
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-primary-foreground/70 text-lg mt-4 max-w-xl leading-relaxed"
          >
            Brickstone Real Estate connects discerning clients with premier
            residential and commercial properties across the region.
          </motion.p>
        </div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute bottom-0 left-0 right-0 translate-y-1/2 z-20 max-w-3xl mx-auto px-6"
        >
          <div className="bg-card rounded-3xl shadow-card p-2 flex flex-col sm:flex-row items-stretch gap-2 min-h-[80px]">
            <div className="flex bg-muted rounded-2xl p-1 shrink-0">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex-1 flex items-center gap-2 px-4">
              <Search className="w-4 h-4 text-muted-foreground shrink-0" />
              <input
                type="text"
                placeholder="Search by location, project, or property type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
              />
            </div>
            <Link
              to={`/properties?q=${encodeURIComponent(searchQuery)}&type=${activeTab}`}
              className="bg-primary text-primary-foreground px-6 py-4 rounded-2xl text-sm font-semibold hover:scale-[1.02] transition-transform duration-200 text-center shrink-0"
            >
              Search
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Featured Properties */}
      <SectionReveal className="pt-32 pb-24 max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-12">
          <div>
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Featured
            </span>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground mt-2">
              Premier Properties
            </h2>
          </div>
          <Link
            to="/properties"
            className="hidden sm:flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        {usingFallback && (
          <p className="text-xs text-muted-foreground mb-4">
            Showing bundled listings (API unavailable). Start the backend and
            seed MongoDB for live data.
          </p>
        )}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {isLoading && featuredProperties.length === 0 ? (
            <p className="text-muted-foreground col-span-full">Loading…</p>
          ) : (
            featuredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelect={(p) => setSelectedProperty(p)}
              />
            ))
          )}
        </div>
      </SectionReveal>

      {/* Ongoing Projects */}
      <SectionReveal className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Developments
              </span>
              <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground mt-2">
                Ongoing Projects
              </h2>
            </div>
            <Link
              to="/projects"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              All projects <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projectsLoading && projectList.length === 0 ? (
              <p className="text-muted-foreground col-span-full">Loading…</p>
            ) : (
            projectList.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="group bg-background rounded-3xl shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden"
                role="button"
                tabIndex={0}
                onClick={() => setSelectedProject(project)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") setSelectedProject(project);
                }}
              >
                <div className="p-2">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                    <img
                      src={(project.images && project.images[0]) || project.image || ""}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <span
                      className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-lg ${
                        project.status === "Ongoing"
                          ? "bg-secondary text-secondary-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {project.status}
                    </span>
                  </div>
                </div>
                <div className="px-5 pb-5 pt-2">
                  <h3 className="font-serif text-xl tracking-tight text-foreground">
                    {project.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {project.location} · {project.type}
                  </p>
                </div>
              </motion.div>
            ))
            )}
          </div>
        </div>
      </SectionReveal>

      {/* Why Choose Us */}
      <SectionReveal className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Why Us
          </span>
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground mt-2">
            Built on Trust
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Shield,
              title: "Verified Properties",
              desc: "Every listing is thoroughly verified for legal compliance and quality standards.",
            },
            {
              icon: Award,
              title: "15+ Years Experience",
              desc: "A trusted name in real estate with a proven track record of successful transactions.",
            },
            {
              icon: Clock,
              title: "End-to-End Support",
              desc: "From property search to documentation, we handle every step of your journey.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="text-center p-8 rounded-3xl bg-card shadow-card"
            >
              <div className="w-12 h-12 rounded-2xl bg-secondary/20 flex items-center justify-center mx-auto mb-4">
                <item.icon className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </SectionReveal>

      {/* Testimonials */}
      <SectionReveal className="py-24 bg-card">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Testimonials
            </span>
            <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-foreground mt-2">
              Client Stories
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-background p-8 rounded-3xl shadow-card"
              >
                <Quote className="w-8 h-8 text-secondary/40 mb-4" />
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                  "{t.text}"
                </p>
                <div>
                  <p className="font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionReveal>

      {/* CTA */}
      <SectionReveal className="py-24 max-w-7xl mx-auto px-6">
        <div className="bg-primary rounded-3xl p-12 md:p-16 text-center">
          <h2 className="font-serif text-4xl md:text-5xl tracking-tight text-primary-foreground">
            Ready to Find Your Space?
          </h2>
          <p className="text-primary-foreground/70 mt-4 max-w-lg mx-auto leading-relaxed">
            Let our experts guide you to the perfect property. Get in touch today
            for a personalized consultation.
          </p>
          <Link
            to="/contact"
            className="inline-block mt-8 bg-secondary text-secondary-foreground px-8 py-3.5 rounded-xl font-semibold hover:scale-[1.02] transition-transform duration-200"
          >
            Get in Touch
          </Link>
        </div>
      </SectionReveal>

      <DetailsModal
        open={!!selectedProperty}
        onClose={() => setSelectedProperty(null)}
        kind="property"
        item={selectedProperty}
      />
      <DetailsModal
        open={!!selectedProject}
        onClose={() => setSelectedProject(null)}
        kind="project"
        item={selectedProject}
      />
    </main>
  );
};

export default Index;


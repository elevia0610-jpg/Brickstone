import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, CheckCircle } from "lucide-react";
import { useResolvedProjects } from "@/hooks/usePublicListings";
import SectionReveal from "@/components/SectionReveal";
import { Link } from "react-router-dom";
import DetailsModal from "@/components/DetailsModal";
import type { Project } from "@/lib/data";

const statuses = ["All", "Ongoing", "Completed"] as const;

const Projects = () => {
  const [activeStatus, setActiveStatus] = useState<string>("All");
  const { projects, isLoading, usingFallback } = useResolvedProjects();
  const [selected, setSelected] = useState<Project | null>(null);

  const filtered = projects.filter(
    (p) => activeStatus === "All" || p.status === activeStatus
  );

  return (
    <main className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <SectionReveal>
          <span className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Portfolio
          </span>
          <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-foreground mt-2 mb-8">
            Our Projects
          </h1>

          <div className="flex bg-muted rounded-2xl p-1 w-fit mb-12">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setActiveStatus(s)}
                className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  activeStatus === s
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </SectionReveal>

        {usingFallback && (
          <p className="text-xs text-muted-foreground mb-6">
            Showing bundled projects (API unavailable).
          </p>
        )}

        <div className="flex flex-col gap-8">
          {isLoading && projects.length === 0 ? (
            <p className="text-muted-foreground">Loading…</p>
          ) : (
          filtered.map((project) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="group bg-card rounded-3xl shadow-card hover:shadow-card-hover transition-shadow duration-300 overflow-hidden flex flex-col md:flex-row"
              role="button"
              tabIndex={0}
              onClick={() => setSelected(project)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setSelected(project);
              }}
            >
              <div className="p-2 md:w-2/5">
                <div className="relative aspect-[4/3] md:aspect-auto md:h-full rounded-2xl overflow-hidden">
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
              <div className="p-6 md:p-8 md:w-3/5 flex flex-col justify-center">
                <span className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  {project.type}
                </span>
                <h2 className="font-serif text-3xl tracking-tight text-foreground mt-1">
                  {project.title}
                </h2>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-2">
                  <MapPin className="w-3.5 h-3.5" /> {project.location}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed mt-4">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  {project.highlights.map((h) => (
                    <span
                      key={h}
                      className="flex items-center gap-1 text-xs font-medium text-foreground bg-muted px-3 py-1.5 rounded-lg"
                    >
                      <CheckCircle className="w-3 h-3 text-secondary" /> {h}
                    </span>
                  ))}
                </div>
                <Link
                  to="/contact"
                  className="mt-6 self-start bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-semibold hover:scale-[1.02] transition-transform duration-200"
                  onClick={(e) => e.stopPropagation()}
                >
                  Inquire About This Project
                </Link>
              </div>
            </motion.div>
          ))
          )}
        </div>

        {!isLoading && filtered.length === 0 && (
          <p className="text-center text-muted-foreground py-16">
            No projects match your filters.
          </p>
        )}
      </div>
      <DetailsModal
        open={!!selected}
        onClose={() => setSelected(null)}
        kind="project"
        item={selected}
      />
    </main>
  );
};

export default Projects;

import { Shield, Award, Users, Target } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";
import heroImage from "@/assets/hero-property.jpg";

const About = () => (
  <main className="pt-28 pb-24">
    <div className="max-w-7xl mx-auto px-6">
      <SectionReveal>
        <span className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          About
        </span>
        <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-foreground mt-2 mb-6">
          Our Story
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-2xl text-lg">
          For over 15 years, Brickstone Real Estate has been a trusted name in
          premium property consulting. We bridge the gap between discerning
          clients and exceptional spaces.
        </p>
      </SectionReveal>

      <SectionReveal className="mt-16">
        <div className="rounded-3xl overflow-hidden aspect-[21/9]">
          <img
            src={heroImage}
            alt="Brickstone Real Estate"
            className="w-full h-full object-cover"
          />
        </div>
      </SectionReveal>

      <SectionReveal className="mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="font-serif text-3xl tracking-tight text-foreground mb-4">
              Our Mission
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              To deliver unparalleled real estate experiences by combining deep
              market knowledge with a client-first approach. Every property we
              present is curated to meet the highest standards of quality,
              location, and value.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-3xl tracking-tight text-foreground mb-4">
              Our Values
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Integrity, transparency, and excellence define every interaction at
              Brickstone Real Estate. We believe in building lasting relationships
              through honest counsel and consistent delivery.
            </p>
          </div>
        </div>
      </SectionReveal>

      <SectionReveal className="mt-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Shield, label: "Properties Sold", value: "500+" },
            { icon: Award, label: "Years Experience", value: "15+" },
            { icon: Users, label: "Happy Clients", value: "1,200+" },
            { icon: Target, label: "Active Projects", value: "8" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-3xl shadow-card p-6 text-center"
            >
              <stat.icon className="w-6 h-6 text-secondary mx-auto mb-3" />
              <p className="font-serif text-3xl tracking-tight text-foreground tabular-nums">
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </SectionReveal>
    </div>
  </main>
);

export default About;

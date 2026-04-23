import { Shield, Award, Users, Target, Home, Building, BrickWall, Banknote, FileText } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";
import heroImage from "@/assets/hero-property.jpg";

const About = () => (
  <main className="pt-28 pb-24">
    <div className="max-w-7xl mx-auto px-6">
      
      {/* Header */}
      <SectionReveal>
        <span className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          About Us
        </span>
        <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-foreground mt-2 mb-6">
          Brick Stone Real Estate
        </h1>
        <p className="text-muted-foreground leading-relaxed max-w-2xl text-lg">
          Brick Stone Real Estate is a trusted name in the real estate industry, built on a foundation of integrity, experience, and a genuine passion for helping people find their perfect home.
        </p>
      </SectionReveal>

      {/* Hero Image */}
      <SectionReveal className="mt-16">
        <div className="rounded-3xl overflow-hidden aspect-[21/9]">
          <img
            src={heroImage}
            alt="Brickstone Real Estate"
            className="w-full h-full object-cover"
          />
        </div>
      </SectionReveal>

      {/* Legacy + Who We Are */}
      <SectionReveal className="mt-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 className="font-serif text-3xl tracking-tight text-foreground mb-4">
              Our Legacy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Our journey began over 16 years ago under the name Bajrang Builders, founded by my father who built a strong reputation of trust and reliability in the local real estate and construction material industry.
              <br /><br />
              What started as an offline business has grown into a full-service real estate platform — and that same commitment to quality and honesty still drives everything we do today.
            </p>
          </div>

          <div>
            <h2 className="font-serif text-3xl tracking-tight text-foreground mb-4">
              Who We Are
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Brick Stone Real Estate is a modern real estate company carrying forward a legacy of 16+ years.
              <br /><br />
              We combine deep industry knowledge with a customer-first approach to help individuals, families, and investors make the right property decisions — with confidence.
            </p>
          </div>
        </div>
      </SectionReveal>

      {/* What We Offer */}
      <SectionReveal className="mt-24">
        <h2 className="font-serif text-3xl tracking-tight text-foreground mb-10">
          What We Offer
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { icon: Home, text: "Property Buying & Selling — Residential and commercial properties across prime locations" },
            { icon: Building, text: "New Construction Projects — Quality-built homes and developments" },
            { icon: BrickWall, text: "Building Materials — Premium construction materials sourced directly" },
            { icon: Banknote, text: "Home Loan Assistance — End-to-end guidance to secure the best loan" },
            { icon: FileText, text: "Property Consultation — Expert advice tailored to your needs" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-4 bg-card p-6 rounded-3xl shadow-card">
              <item.icon className="w-6 h-6 text-secondary mt-1" />
              <p className="text-muted-foreground leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </SectionReveal>

      {/* Why Choose Us */}
      <SectionReveal className="mt-24">
        <h2 className="font-serif text-3xl tracking-tight text-foreground mb-10">
          Why Choose Us
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            "16+ years of industry experience",
            "Trusted by hundreds of families and investors",
            "End-to-end support from property search to possession",
            "Transparent dealings with no hidden charges",
            "Deep local market knowledge",
          ].map((point, i) => (
            <div key={i} className="bg-card p-6 rounded-3xl shadow-card">
              <p className="text-muted-foreground">{point}</p>
            </div>
          ))}
        </div>
      </SectionReveal>

      {/* Mission */}
      <SectionReveal className="mt-24">
        <div className="max-w-3xl">
          <h2 className="font-serif text-3xl tracking-tight text-foreground mb-4">
            Our Mission
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            To make real estate simple, transparent, and accessible for every individual — whether you are buying your first home, investing in property, or building from the ground up.
          </p>
        </div>
      </SectionReveal>

      {/* Stats */}
      <SectionReveal className="mt-24">
        <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
          {[
            { icon: Award, label: "Years Experience", value: "16+" },
            { icon: Target, label: "Active Projects", value: "8+" },
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

      {/* Footer Tagline */}
      <SectionReveal className="mt-24 text-center">
        <p className="font-serif text-xl text-foreground">
          Brick Stone Real Estate — Built on Trust. Backed by Legacy.
        </p>
      </SectionReveal>

    </div>
  </main>
);

export default About;
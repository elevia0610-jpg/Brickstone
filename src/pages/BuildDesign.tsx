import { useState } from "react";
import SectionReveal from "@/components/SectionReveal";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

const initialState = {
  name: "",
  phone: "",
  city: "",
  plotSize: "",
  budget: "",
  message: "",
};

const BuildDesign = () => {
  const [formData, setFormData] = useState(initialState);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const base = import.meta.env.VITE_API_URL;

      const res = await fetch(`${base}/api/build-design`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Inquiry submitted successfully");
        setFormData(initialState);
      } else {
        toast.error(data.error || "Failed to submit");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <main className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* HERO */}
        <SectionReveal>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-6">
            Build Your Dream Property on Your Land
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg">
            Have a plot but don’t know where to start? Brickstone handles everything —
            from design to construction — exactly the way you want it.
          </p>
        </SectionReveal>

        {/* SERVICES */}
        <SectionReveal className="mt-24">
          <h2 className="font-serif text-3xl mb-10 text-foreground">
            What We Offer
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Custom Naksha / Floor Plan Design",
              "Architecture & Interior Planning",
              "Construction as per your budget",
              "Legal approvals & permissions",
              "Material selection support",
              "Project timeline management",
            ].map((item, i) => (
              <div key={i} className="bg-card p-6 rounded-3xl shadow-card flex gap-3">
                <CheckCircle className="text-secondary mt-1" />
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* HOW IT WORKS */}
        <SectionReveal className="mt-24">
          <h2 className="font-serif text-3xl mb-10 text-foreground">
            How It Works
          </h2>

          <div className="grid md:grid-cols-5 gap-6">
            {[
              "Share your land details",
              "We design your naksha",
              "You approve the plan",
              "Construction begins",
              "Handover on time",
            ].map((step, i) => (
              <div key={i} className="bg-card p-6 rounded-3xl text-center">
                <p className="text-secondary font-semibold mb-2">Step {i + 1}</p>
                <p className="text-muted-foreground text-sm">{step}</p>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* WHY CHOOSE US */}
        <SectionReveal className="mt-24">
          <h2 className="font-serif text-3xl mb-10 text-foreground">
            Why Choose Us
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Build exactly what YOU want",
              "Transparent pricing",
              "No hidden costs",
              "Experienced team",
            ].map((item, i) => (
              <div key={i} className="bg-card p-6 rounded-3xl shadow-card">
                <p className="text-muted-foreground">{item}</p>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* FORM */}
        <SectionReveal className="mt-24">
          <h2 className="font-serif text-3xl mb-6 text-foreground">
            Start Your Project
          </h2>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">

            <input
              type="text"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-card p-4 rounded-xl border border-border"
              required
            />

            <input
              type="text"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-card p-4 rounded-xl border border-border"
              required
            />

            <input
              type="text"
              placeholder="City"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="bg-card p-4 rounded-xl border border-border"
            />

            <input
              type="text"
              placeholder="Plot Size (sq ft / gaj)"
              value={formData.plotSize}
              onChange={(e) => setFormData({ ...formData, plotSize: e.target.value })}
              className="bg-card p-4 rounded-xl border border-border"
            />

            <input
              type="text"
              placeholder="Budget Range"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              className="bg-card p-4 rounded-xl border border-border md:col-span-2"
            />

            <textarea
              placeholder="Message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="bg-card p-4 rounded-xl border border-border md:col-span-2"
              rows={4}
            />

            <button className="bg-secondary text-background py-4 rounded-xl md:col-span-2">
              Submit Inquiry
            </button>
          </form>
        </SectionReveal>

      </div>
    </main>
  );
};

export default BuildDesign;
import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send, Clock } from "lucide-react";
import SectionReveal from "@/components/SectionReveal";
import { toast } from "sonner";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    reasonToBuy: "Investment" as "Investment" | "Self Use",
    isDealer: "No" as "Yes" | "No",
    interests: [] as string[],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const base = import.meta.env.VITE_API_URL;
      const res = await fetch(`${base}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Message sent successfully");
        setForm((f) => ({ ...f, message: "", interests: [] }));
      } else {
        toast.error(data.error || "Failed to send message");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  };

  return (
    <main className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <SectionReveal>
          <span className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Reach Out
          </span>
          <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-foreground mt-2 mb-6">
            Get in Touch
          </h1>
        </SectionReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-8">
          {/* Form */}
          <SectionReveal>
            <form
              onSubmit={handleSubmit}
              className="bg-card rounded-3xl shadow-card p-8 space-y-5"
            >
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full mt-2 bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full mt-2 bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition"
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full mt-2 bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition"
                  placeholder="+91 74283 11662"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Your reason to buy
                  </label>
                  <div className="mt-3 space-y-2 text-sm">
                    {(["Investment", "Self Use"] as const).map((v) => (
                      <label
                        key={v}
                        className="flex items-center gap-2 text-muted-foreground"
                      >
                        <input
                          type="radio"
                          name="reasonToBuy"
                          checked={form.reasonToBuy === v}
                          onChange={() => setForm((f) => ({ ...f, reasonToBuy: v }))}
                        />
                        <span className="text-foreground">{v}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Are you a property dealer?
                  </label>
                  <div className="mt-3 space-y-2 text-sm">
                    {(["Yes", "No"] as const).map((v) => (
                      <label
                        key={v}
                        className="flex items-center gap-2 text-muted-foreground"
                      >
                        <input
                          type="radio"
                          name="isDealer"
                          checked={form.isDealer === v}
                          onChange={() => setForm((f) => ({ ...f, isDealer: v }))}
                        />
                        <span className="text-foreground">{v}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Optional interests
                </label>
                <div className="mt-3 space-y-2 text-sm">
                  {[
                    { id: "Interested in Home Loan", label: "I am interested in home loan" },
                    { id: "Interested in Site Visit", label: "I am interested in site visits" },
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className="flex items-center gap-2 text-muted-foreground"
                    >
                      <input
                        type="checkbox"
                        checked={form.interests.includes(opt.id)}
                        onChange={(e) => {
                          setForm((f) => {
                            const next = new Set(f.interests);
                            if (e.target.checked) next.add(opt.id);
                            else next.delete(opt.id);
                            return { ...f, interests: Array.from(next) };
                          });
                        }}
                      />
                      <span className="text-foreground">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full mt-2 bg-background border border-border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition resize-none"
                  placeholder="Tell us about your requirements..."
                />
              </div>
              <button
                type="submit" onClick={handleSubmit}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl text-sm font-semibold hover:scale-[1.01] transition-transform duration-200 flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" /> Send Inquiry
              </button>
            </form>
          </SectionReveal>

          {/* Info */}
          <SectionReveal>
            <div className="space-y-6">
              <div className="bg-card rounded-3xl shadow-card p-8">
                <h3 className="font-semibold text-foreground mb-4">
                  Contact Information
                </h3>
                <div className="space-y-4">
                  <a
                    href="tel:+917428311662"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Phone className="w-5 h-5 text-secondary" /> +91 74283 11662
                  </a>
                  <a
                    href="mailto:brickstonerealestate01@gmail.com"
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Mail className="w-5 h-5 text-secondary" />{" "}
                    brickstonerealestate01@gmail.com
                  </a>
                  <a
                    className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Clock className="w-5 h-5 text-secondary" />{" "}
                    Mon - Sun  ( 9:00 AM - 5:00 PM )
                  </a>
                </div>
              </div>

              <a
                href="https://wa.me/917428311662?text=Hi%2C%20I%27m%20interested%20in%20a%20property."
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] text-primary-foreground py-3.5 rounded-xl font-semibold hover:scale-[1.01] transition-transform duration-200"
              >
                <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
              </a>

              
            </div>
          </SectionReveal>
        </div>
      </div>
    </main>
  );
};

export default Contact;

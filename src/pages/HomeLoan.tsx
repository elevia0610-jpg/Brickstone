import SectionReveal from "@/components/SectionReveal";
import { CheckCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
const loanTypes = [
  {
    title: "Home Purchase Loan",
    desc: "Buying a new or pre-owned residential property.",
  },
  {
    title: "Home Construction Loan",
    desc: "Financing the construction of a house on land you already own.",
  },
  {
    title: "Home Renovation Loan",
    desc: "Funding repairs, painting, or structural upgrades.",
  },
  {
    title: "Plot + Construction Loan",
    desc: "Purchase land and build your home immediately.",
  },
  {
    title: "Balance Transfer Loan",
    desc: "Switch your existing loan to get better interest rates.",
  },
  {
    title: "Top-Up Loan",
    desc: "Access extra funds over your existing loan.",
  },
];
const initialState = {
    name: "",
    email: "",
    phone: "",
    loanType: "",
    amount: "",
    callbackTime: "",
};

const HomeLoan = () => {
  const [formData, setFormData] = useState(initialState);
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const base = import.meta.env.VITE_API_URL;

    const res = await fetch(`${base}/api/homeloan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Inquiry submitted successfully");
      setFormData(initialState);
    } else {
      alert(data.error || "Failed to submit");
    }
    } catch (err) {
    console.error(err);
    alert("Something went wrong");
    }
  };
  return (
    <main className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6">

        {/* HERO */}
        <SectionReveal>
          <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-foreground mb-6">
            Your Path to a New Home
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
            Finding the right home is a journey; finding the right loan shouldn't be a hurdle.
            Whether you are buying your first apartment, building on your own land,
            or upgrading your current space, our flexible financing solutions are designed to move with you.
          </p>
        </SectionReveal>

        {/* LOAN TYPES */}
        <SectionReveal className="mt-24">
          <h2 className="font-serif text-3xl text-foreground mb-10">
            Our Lending Solutions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {loanTypes.map((loan, i) => (
              <div
                key={i}
                className="bg-card p-6 rounded-3xl shadow-card"
              >
                <p className="font-semibold text-foreground mb-2">
                  {loan.title}
                </p>
                <p className="text-muted-foreground text-sm">
                  {loan.desc}
                </p>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* WHY CHOOSE US */}
        <SectionReveal className="mt-24">
          <h2 className="font-serif text-3xl text-foreground mb-10">
            Why Choose Us?
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                title: "Competitive Interest Rates",
                desc: "Benefit from some of the most attractive rates in the market to keep your EMIs manageable.",
              },
              {
                title: "Seamless Digital Process",
                desc: "Apply from the comfort of your home with complete digital documentation.",
              },
              {
                title: "Flexible Tenure",
                desc: "Choose repayment periods from 5 to 30 years.",
              },
              {
                title: "Transparent Processing",
                desc: "No hidden charges. Complete clarity from start to finish.",
              },
            ].map((item, i) => (
              <div key={i} className="bg-card p-6 rounded-3xl shadow-card">
                <div className="flex items-start gap-3">
                  <CheckCircle className="text-secondary w-5 h-5 mt-1" />
                  <div>
                    <p className="font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="text-muted-foreground text-sm mt-1">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* BANKING NETWORK */}
        <SectionReveal className="mt-24">
          <h2 className="font-serif text-3xl text-foreground mb-6">
            Our Banking Network
          </h2>

          <p className="text-muted-foreground leading-relaxed max-w-3xl">
            You aren’t limited to just one option. We have established strong strategic
            partnerships with leading national and private banks, as well as premier housing finance companies.
            <br /><br />
            By leveraging our extensive network, we compare multiple lending portfolios
            to find the most favorable terms for your specific profile. This means:
          </p>

          <div className="mt-8 grid md:grid-cols-3 gap-6">
            {[
              "Higher Approval Rates",
              "Negotiated Rates",
              "Unbiased Comparisons",
            ].map((item, i) => (
              <div key={i} className="bg-card p-6 rounded-3xl shadow-card text-center">
                <p className="text-foreground font-medium">{item}</p>
              </div>
            ))}
          </div>
        </SectionReveal>

        {/* FORM */}
        <SectionReveal className="mt-24">
          <h2 className="font-serif text-3xl text-foreground mb-6">
            Inquiry Form
          </h2>

          <p className="text-muted-foreground mb-8 max-w-2xl">
            Fill out the form below, and one of our mortgage specialists will contact you within 24 hours.
          </p>

          <form className="grid md:grid-cols-2 gap-6">

            <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-card p-4 rounded-xl border border-border text-foreground"
            />

            <input
                type="text"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-card p-4 rounded-xl border border-border text-foreground"
            />

            <input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="bg-card p-4 rounded-xl border border-border text-foreground"
            />

            <input
              type="text"
              placeholder="Estimated Loan Amount"
              className="bg-card p-4 rounded-xl border border-border text-foreground md:col-span-2"
            />

            {/* Loan Type */}
            <div className="md:col-span-2">
                <p className="text-foreground mb-3">Interested Loan Type</p>

                <div className="grid md:grid-cols-2 gap-2 text-muted-foreground text-sm">
                    {[
                    "Home Purchase Loan",
                    "Home Construction Loan",
                    "Home Renovation Loan",
                    "Plot + Construction Loan",
                    "Balance Transfer Loan",
                    "Top-Up Loan",
                    ].map((type) => (
                    <label key={type} className="flex items-center gap-2">
                        <input
                        type="radio"
                        name="loanType"
                        checked={formData.loanType === type}
                        onChange={() => setFormData({ ...formData, loanType: type })}
                        />
                        {type}
                    </label>
                    ))}
                </div>
            </div>

            {/* Time */}
            <div className="md:col-span-2">
                <p className="text-foreground mb-3">Preferred Time for Callback</p>

                <div className="flex flex-col gap-2 text-muted-foreground text-sm">
                    {[
                    "Morning (9 AM – 12 PM)",
                    "Afternoon (12 PM – 5 PM)",
                    "Evening (5 PM – 8 PM)",
                    ].map((time) => (
                    <label key={time} className="flex items-center gap-2">
                        <input
                        type="radio"
                        name="callbackTime"
                        checked={formData.callbackTime === time}
                        onChange={() => setFormData({ ...formData, callbackTime: time })}
                        />
                        {time}
                    </label>
                    ))}
                </div>
            </div>

            <button
              type="submit" onClick={handleSubmit}
              className="md:col-span-2 bg-secondary text-background py-4 rounded-xl font-semibold hover:opacity-90 transition"
            >
              Submit Inquiry
            </button>

          </form>
        </SectionReveal>

      </div>
    </main>
  );
};

export default HomeLoan;
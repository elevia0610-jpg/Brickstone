import { Link } from "react-router-dom";
import { Phone, Mail, MapPin } from "lucide-react";

const Footer = () => (
  <footer className="bg-primary text-primary-foreground">
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="md:col-span-1">
          <span className="font-serif text-3xl tracking-tight">Brickstone</span>
          <p className="text-sm opacity-70 mt-4 leading-relaxed">
            Connecting discerning clients with premier residential and commercial
            properties across the region.
          </p>
        </div>
        <div>
          <h4 className="font-sans text-xs font-semibold uppercase tracking-widest mb-4 opacity-50">
            Quick Links
          </h4>
          <nav className="flex flex-col gap-2">
            {[
              { to: "/properties", label: "Properties" },
              { to: "/projects", label: "Projects" },
              { to: "/about", label: "About Us" },
              { to: "/contact", label: "Contact" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm opacity-70 hover:opacity-100 transition-opacity"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div>
          <h4 className="font-sans text-xs font-semibold uppercase tracking-widest mb-4 opacity-50">
            Services
          </h4>
          <div className="flex flex-col gap-2 text-sm opacity-70">
            <span>Buy Properties</span>
            <span>Rent Properties</span>
            <span>Lease Properties</span>
            <span>Property Management</span>
          </div>
        </div>
        <div>
          <h4 className="font-sans text-xs font-semibold uppercase tracking-widest mb-4 opacity-50">
            Contact
          </h4>
          <div className="flex flex-col gap-3 text-sm opacity-70">
            <a href="tel:+919876543210" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
              <Phone className="w-4 h-4" /> +91 98765 43210
            </a>
            <a href="mailto:info@Brickstonerealestate.com" className="flex items-center gap-2 hover:opacity-100 transition-opacity">
              <Mail className="w-4 h-4" /> info@Brickstonerealestate.com
            </a>
            <span className="flex items-start gap-2">
              <MapPin className="w-4 h-4 mt-0.5 shrink-0" /> 123 Business Avenue, BKC, Mumbai
            </span>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 mt-12 pt-8 text-center text-sm opacity-50">
        © {new Date().getFullYear()} Brickstone Real Estate. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;

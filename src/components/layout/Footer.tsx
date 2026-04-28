import { Link } from "react-router-dom"
import { Gift, Mail, Phone, MapPin } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const footerLinks = {
  Shop: [
    { label: "All Products", href: "/catalog" },
    { label: "New Arrivals", href: "/catalog?filter=new" },
    { label: "Bestsellers", href: "/catalog?filter=bestseller" },
    { label: "Gift Hampers", href: "/catalog?category=hampers" },
  ],
  Help: [
    { label: "FAQ", href: "/faq" },
    { label: "Shipping", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "Track Order", href: "/orders" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Gift className="size-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg tracking-tight">GiftNest</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              India's premier AI-powered gift shop. Find the perfect gift for every occasion with our smart recommendation engine.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Instagram</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Twitter</a>
              <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">Facebook</a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="font-semibold text-sm mb-3">{section}</h3>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.href}>
                    <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex flex-wrap gap-4 justify-center md:justify-start">
            <span className="flex items-center gap-1.5">
              <Mail className="size-3" /> support@giftnest.in
            </span>
            <span className="flex items-center gap-1.5">
              <Phone className="size-3" /> +91 98765 43210
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-3" /> Mumbai, India
            </span>
          </div>
          <p className="text-xs">© 2026 GiftNest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

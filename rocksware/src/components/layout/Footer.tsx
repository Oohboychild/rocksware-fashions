import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-[#F5F0E8] mt-24">
      <div className="section-padding py-20">
        <div className="container-narrow">

          {/* Top — 3 clean columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16 pb-16 border-b border-[#1C1C1E]">

            {/* Brand */}
            <div>
              <h2 className="font-display text-4xl tracking-[0.15em] uppercase mb-5">
                Rocksware
              </h2>
              <p className="text-[#6E6860] text-sm leading-relaxed font-body font-light max-w-xs">
                Premium footwear for the discerning individual. Crafted with intention, worn with confidence.
              </p>
              <div className="flex gap-2 mt-8 flex-wrap">
                {["M-Pesa", "Airtel Money", "Visa"].map((p) => (
                  <span
                    key={p}
                    className="border border-[#2C2825] text-[#6E6860] text-[10px] px-3 py-1.5 tracking-widest uppercase font-body"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-[10px] tracking-[0.25em] uppercase mb-6 text-[#C4956A] font-body font-medium">
                Shop
              </h4>
              <ul className="space-y-4">
                {[
                  { label: "Sneakers", href: "/shop?category=sneakers" },
                  { label: "Heels", href: "/shop?category=heels" },
                  { label: "Boots", href: "/shop?category=boots" },
                  { label: "Loafers", href: "/shop?category=loafers" },
                  { label: "Sandals", href: "/shop?category=sandals" },
                  { label: "New Arrivals", href: "/shop?featured=true" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-[#6E6860] hover:text-[#F5F0E8] transition-colors font-body font-light tracking-wide"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Info */}
            <div>
              <h4 className="text-[10px] tracking-[0.25em] uppercase mb-6 text-[#C4956A] font-body font-medium">
                Info
              </h4>
              <ul className="space-y-4">
                {[
                  { label: "Size Guide", href: "#" },
                  { label: "Shipping & Returns", href: "#" },
                  { label: "Track Order", href: "#" },
                  { label: "Contact Us", href: "#" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-[#6E6860] hover:text-[#F5F0E8] transition-colors font-body font-light tracking-wide"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="mt-8 space-y-2">
                <p className="text-sm text-[#6E6860] font-body font-light">Nairobi, Kenya</p>
                <p className="text-sm text-[#6E6860] font-body font-light">info@rocksware.co.ke</p>
                <p className="text-sm text-[#6E6860] font-body font-light">+254 700 000 000</p>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#3A3A3C] text-xs font-body">
              © {new Date().getFullYear()} Rocksware. All rights reserved.
            </p>
            <div className="flex gap-8">
              {["Privacy Policy", "Terms of Service"].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-[#3A3A3C] text-xs hover:text-[#6E6860] transition-colors font-body"
                >
                  {item}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
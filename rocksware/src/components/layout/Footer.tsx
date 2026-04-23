import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-[#F5F0E8] mt-24">
      <div className="section-padding py-16">
        <div className="container-narrow">

          {/* Top */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-[#2C2825]">

            {/* Brand */}
            <div className="md:col-span-1">
              <h2 className="font-display text-3xl tracking-[0.15em] uppercase mb-4">
                Rocksware
              </h2>
              <p className="text-[#B5AFA6] text-xs leading-relaxed font-body font-light">
                Premium footwear for the discerning individual. Crafted with intention, worn with confidence.
              </p>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-xs tracking-widest uppercase mb-5 text-[#C4956A] font-body">
                Shop
              </h4>
              <ul className="space-y-3">
                {["Sneakers", "Heels", "Boots", "Loafers", "Sandals", "New In"].map((item) => (
                  <li key={item}>
                    <Link
                      href={`/shop?category=${item.toLowerCase()}`}
                      className="text-xs text-[#B5AFA6] hover:text-[#F5F0E8] transition-colors tracking-wide"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="text-xs tracking-widest uppercase mb-5 text-[#C4956A] font-body">
                Help
              </h4>
              <ul className="space-y-3">
                {["Size Guide", "Shipping & Returns", "Track Order", "Contact Us", "FAQs"].map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-xs text-[#B5AFA6] hover:text-[#F5F0E8] transition-colors tracking-wide"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xs tracking-widest uppercase mb-5 text-[#C4956A] font-body">
                Contact
              </h4>
              <ul className="space-y-3 text-xs text-[#B5AFA6] font-body font-light">
                <li>Nairobi, Kenya</li>
                <li>info@rocksware.co.ke</li>
                <li>+254 700 000 000</li>
                <li className="pt-2">
                  <span className="text-[#F5F0E8] text-xs tracking-wide">We accept</span>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {["M-Pesa", "Airtel Money", "Visa"].map((p) => (
                      <span
                        key={p}
                        className="border border-[#2C2825] text-[#B5AFA6] text-[10px] px-2 py-1 tracking-wide"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom */}
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[#6E6860] text-xs font-body">
              © {new Date().getFullYear()} Rocksware. All rights reserved.
            </p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service"].map((item) => (
                <Link
                  key={item}
                  href="#"
                  className="text-[#6E6860] text-xs hover:text-[#B5AFA6] transition-colors"
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
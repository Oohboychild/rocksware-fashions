import Link from "next/link";

export default function HomePage() {
  const categories = [
    { label: "Sneakers", href: "/shop?category=sneakers", desc: "Street to studio" },
    { label: "Heels", href: "/shop?category=heels", desc: "Elevation redefined" },
    { label: "Boots", href: "/shop?category=boots", desc: "Built to last" },
    { label: "Loafers", href: "/shop?category=loafers", desc: "Effortless ease" },
    { label: "Sandals", href: "/shop?category=sandals", desc: "Open air luxury" },
    { label: "Formal", href: "/shop?category=formal", desc: "Command the room" },
  ];

  return (
    <div className="min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative bg-[#0A0A0A] min-h-[90vh] flex items-center">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 20% 80%, #C4956A 0%, transparent 50%), radial-gradient(circle at 80% 20%, #C4956A 0%, transparent 50%)" }}
        />

        <div className="section-padding w-full relative z-10">
          <div className="container-narrow">
            <div className="max-w-2xl">
              <p className="text-[#C4956A] text-xs tracking-[0.3em] uppercase font-body mb-6">
                New Collection — 2025
              </p>
              <h1 className="font-display text-[#F5F0E8] text-6xl md:text-8xl leading-none mb-8">
                Walk in<br />
                <span className="italic text-[#C4956A]">Confidence</span>
              </h1>
              <p className="text-[#B5AFA6] font-body font-light text-base leading-relaxed mb-12 max-w-md">
                Premium footwear crafted for those who move with purpose. From the boardroom to the streets of Nairobi.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/shop" className="btn-cognac text-center">
                  Shop Now
                </Link>
                <Link href="/shop?featured=true" className="btn-outline text-[#F5F0E8] border-[#F5F0E8] hover:bg-[#F5F0E8] hover:text-[#0A0A0A] text-center">
                  New Arrivals
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-12 bg-gradient-to-b from-transparent to-[#C4956A]" />
          <p className="text-[#6E6860] text-[10px] tracking-[0.3em] uppercase font-body">Scroll</p>
        </div>
      </section>

      {/* ── MARQUEE ──────────────────────────────────────────────────── */}
      <div className="bg-[#C4956A] py-3 overflow-hidden">
        <div className="flex gap-12 animate-none whitespace-nowrap">
          {Array(6).fill(null).map((_, i) => (
            <span key={i} className="text-white text-xs tracking-[0.25em] uppercase font-body shrink-0 px-8">
              Free Delivery in Nairobi &nbsp;·&nbsp; Authentic Footwear &nbsp;·&nbsp; Easy Returns &nbsp;·&nbsp; Pay with M-Pesa
            </span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ───────────────────────────────────────────────── */}
      <section className="section-padding py-24">
        <div className="container-narrow">
          <div className="text-center mb-16">
            <p className="text-[#C4956A] text-xs tracking-[0.3em] uppercase font-body mb-3">
              Explore
            </p>
            <h2 className="font-display text-4xl md:text-5xl text-[#0A0A0A]">
              Shop by Category
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="group relative bg-[#0A0A0A] aspect-square overflow-hidden flex flex-col justify-end p-6 hover:bg-[#2C2825] transition-colors duration-300"
              >
                {/* Corner accent */}
                <div className="absolute top-4 right-4 w-6 h-6 border-t border-r border-[#C4956A] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 w-6 h-6 border-b border-l border-[#C4956A] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <p className="text-[#6E6860] text-[10px] tracking-[0.25em] uppercase font-body mb-1 group-hover:text-[#C4956A] transition-colors">
                  {cat.desc}
                </p>
                <h3 className="font-display text-[#F5F0E8] text-2xl md:text-3xl">
                  {cat.label}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED STRIP ───────────────────────────────────────────── */}
      <section className="bg-[#0A0A0A] section-padding py-24">
        <div className="container-narrow">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-4">
            <div>
              <p className="text-[#C4956A] text-xs tracking-[0.3em] uppercase font-body mb-3">
                Handpicked
              </p>
              <h2 className="font-display text-4xl md:text-5xl text-[#F5F0E8]">
                Featured Styles
              </h2>
            </div>
            <Link
              href="/shop"
              className="text-[#B5AFA6] text-xs tracking-widest uppercase font-body hover:text-[#C4956A] transition-colors border-b border-[#2C2825] hover:border-[#C4956A] pb-1"
            >
              View All →
            </Link>
          </div>

          {/* Placeholder cards — will be replaced with real products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array(4).fill(null).map((_, i) => (
              <div key={i} className="group cursor-pointer">
                <div className="bg-[#2C2825] aspect-[3/4] mb-4 relative overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-[#6E6860] text-xs tracking-widest uppercase font-body">
                      Coming Soon
                    </p>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-[#C4956A] py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-xs tracking-widest uppercase text-center font-body">
                      Quick Add
                    </p>
                  </div>
                </div>
                <p className="text-[#6E6860] text-[10px] tracking-widest uppercase font-body mb-1">
                  Rocksware
                </p>
                <h4 className="font-display text-[#F5F0E8] text-lg mb-1">
                  Signature Style {i + 1}
                </h4>
                <p className="text-[#C4956A] font-body text-sm">
                  KES {(4500 + i * 1500).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ROCKSWARE ────────────────────────────────────────────── */}
      <section className="section-padding py-24">
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
            {[
              { title: "Authentic Quality", desc: "Every pair curated for quality, comfort, and longevity. No compromises." },
              { title: "Pay Your Way", desc: "M-Pesa, Airtel Money, or Visa. Checkout the way that works for you." },
              { title: "Nairobi Delivery", desc: "Same-day delivery within Nairobi. Countrywide shipping available." },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center">
                <div className="w-px h-12 bg-[#C4956A] mb-8" />
                <h3 className="font-display text-2xl text-[#0A0A0A] mb-4">
                  {item.title}
                </h3>
                <p className="text-[#6E6860] font-body font-light text-sm leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────── */}
      <section className="section-padding py-20 bg-[#C4956A]">
        <div className="container-narrow text-center">
          <h2 className="font-display text-4xl md:text-6xl text-white mb-6">
            Your Next Pair<br />
            <span className="italic">Awaits</span>
          </h2>
          <p className="text-white/80 font-body font-light text-sm mb-10 max-w-md mx-auto">
            Join thousands of Kenyans who trust Rocksware for premium footwear delivered to their door.
          </p>
          <Link href="/shop" className="btn-primary bg-white text-[#0A0A0A] hover:bg-[#0A0A0A] hover:text-white">
            Start Shopping
          </Link>
        </div>
      </section>

    </div>
  );
}
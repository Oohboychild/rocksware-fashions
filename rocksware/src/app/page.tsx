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
      <section className="relative bg-[#0A0A0A] min-h-screen flex items-center">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(ellipse at 10% 90%, #C4956A 0%, transparent 55%), radial-gradient(ellipse at 90% 10%, #C4956A 0%, transparent 55%)",
          }}
        />

        <div className="section-padding w-full relative z-10">
          <div className="container-narrow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

              {/* Left */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-8 h-px bg-[#C4956A]" />
                  <p className="text-[#C4956A] text-xs tracking-[0.35em] uppercase font-body">
                    New Collection 2025
                  </p>
                </div>
                <h1 className="font-display text-[#F5F0E8] text-7xl md:text-8xl leading-[0.95] mb-8">
                  Walk in<br />
                  <em className="text-[#C4956A] not-italic">Style</em>
                </h1>
                <p className="text-[#6E6860] font-body font-light text-base leading-relaxed mb-10 max-w-sm">
                  Premium footwear curated for those who move with purpose. From Nairobi's streets to the boardroom.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/shop"
                    className="btn-cognac"
                  >
                    Shop Now
                  </Link>
                  <Link
                    href="/shop?featured=true"
                    style={{
                      border: "1px solid #3A3A3C",
                      color: "#F5F0E8",
                      padding: "12px 32px",
                      fontSize: "13px",
                      letterSpacing: "0.15em",
                      textTransform: "uppercase",
                      fontFamily: "Jost, sans-serif",
                      transition: "all 0.3s ease",
                      display: "inline-block",
                    }}
                  >
                    New Arrivals
                  </Link>
                </div>
              </div>

              {/* Right — hero visual */}
              <div className="hidden md:flex justify-end">
                <div className="relative">
                  <div
                    style={{
                      width: "380px",
                      height: "480px",
                      backgroundColor: "#1C1C1E",
                      border: "1px solid #2C2825",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0, left: 0, right: 0, bottom: 0,
                        background: "radial-gradient(circle at 50% 60%, #C4956A22 0%, transparent 70%)",
                      }}
                    />
                    <p
                      style={{
                        fontFamily: "Georgia, serif",
                        fontSize: "13px",
                        color: "#3A3A3C",
                        letterSpacing: "0.3em",
                        textTransform: "uppercase",
                      }}
                    >
                      Featured Drop
                    </p>
                    {/* Corner accents */}
                    <div style={{ position: "absolute", top: "16px", left: "16px", width: "24px", height: "24px", borderTop: "1px solid #C4956A", borderLeft: "1px solid #C4956A" }} />
                    <div style={{ position: "absolute", top: "16px", right: "16px", width: "24px", height: "24px", borderTop: "1px solid #C4956A", borderRight: "1px solid #C4956A" }} />
                    <div style={{ position: "absolute", bottom: "16px", left: "16px", width: "24px", height: "24px", borderBottom: "1px solid #C4956A", borderLeft: "1px solid #C4956A" }} />
                    <div style={{ position: "absolute", bottom: "16px", right: "16px", width: "24px", height: "24px", borderBottom: "1px solid #C4956A", borderRight: "1px solid #C4956A" }} />
                  </div>
                  {/* Floating price tag */}
                  <div
                    style={{
                      position: "absolute",
                      bottom: "-20px",
                      left: "-20px",
                      backgroundColor: "#C4956A",
                      padding: "16px 20px",
                    }}
                  >
                    <p style={{ fontFamily: "Georgia, serif", fontSize: "11px", color: "white", letterSpacing: "0.2em", textTransform: "uppercase" }}>From</p>
                    <p style={{ fontFamily: "Georgia, serif", fontSize: "22px", color: "white", fontWeight: "600" }}>KES 3,500</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
          <div className="w-px h-14 bg-gradient-to-b from-transparent to-[#C4956A]" />
          <p className="text-[#3A3A3C] text-[10px] tracking-[0.3em] uppercase font-body">Scroll</p>
        </div>
      </section>

      {/* ── TICKER ───────────────────────────────────────────────────── */}
      <div className="bg-[#C4956A] py-3 overflow-hidden">
        <div className="flex whitespace-nowrap">
          {Array(8).fill(null).map((_, i) => (
            <span key={i} className="text-white text-[11px] tracking-[0.2em] uppercase font-body shrink-0 px-10">
              Free Delivery in Nairobi &nbsp;·&nbsp; Authentic Footwear &nbsp;·&nbsp; Easy Returns &nbsp;·&nbsp; Pay with M-Pesa
            </span>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES ───────────────────────────────────────────────── */}
      <section className="section-padding py-28">
        <div className="container-narrow">

          {/* Heading */}
          <div className="flex items-end justify-between mb-14">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-px bg-[#C4956A]" />
                <p className="text-[#C4956A] text-[10px] tracking-[0.35em] uppercase font-body">
                  Explore
                </p>
              </div>
              <h2 className="font-display text-5xl text-[#0A0A0A]">
                Shop by Category
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden md:block text-xs tracking-widest uppercase font-body text-[#6E6860] hover:text-[#C4956A] transition-colors border-b border-transparent hover:border-[#C4956A] pb-1"
            >
              View All →
            </Link>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((cat, i) => (
              <Link
                key={cat.label}
                href={cat.href}
                className="group relative overflow-hidden"
                style={{
                  backgroundColor: i % 2 === 0 ? "#0A0A0A" : "#1C1C1E",
                  aspectRatio: i === 0 || i === 5 ? "auto" : "1",
                  padding: "40px 32px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  minHeight: "200px",
                }}
              >
                {/* Hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(circle at 30% 70%, #C4956A15 0%, transparent 60%)" }}
                />

                {/* Corner accent */}
                <div
                  className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ width: "20px", height: "20px", borderTop: "1px solid #C4956A", borderRight: "1px solid #C4956A" }}
                />

                <p className="text-[#6E6860] text-[10px] tracking-[0.25em] uppercase font-body mb-2 group-hover:text-[#C4956A] transition-colors duration-300 relative z-10">
                  {cat.desc}
                </p>
                <h3 className="font-display text-[#F5F0E8] text-3xl relative z-10">
                  {cat.label}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED ─────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#0A0A0A" }} className="section-padding py-28">
        <div className="container-narrow">

          <div className="flex items-end justify-between mb-14">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-6 h-px bg-[#C4956A]" />
                <p className="text-[#C4956A] text-[10px] tracking-[0.35em] uppercase font-body">
                  Handpicked
                </p>
              </div>
              <h2 className="font-display text-5xl text-[#F5F0E8]">
                Featured Styles
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden md:block text-xs tracking-widest uppercase font-body text-[#6E6860] hover:text-[#C4956A] transition-colors border-b border-transparent hover:border-[#C4956A] pb-1"
            >
              View All →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { name: "Signature Style 1", price: 4500 },
              { name: "Signature Style 2", price: 6000 },
              { name: "Signature Style 3", price: 7500 },
              { name: "Signature Style 4", price: 9000 },
            ].map((item, i) => (
              <div key={i} className="group cursor-pointer">
                <div
                  className="relative overflow-hidden mb-4"
                  style={{ aspectRatio: "3/4", backgroundColor: "#1C1C1E" }}
                >
                  {/* Placeholder */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                    <div style={{ width: "32px", height: "1px", backgroundColor: "#3A3A3C" }} />
                    <p className="text-[#3A3A3C] text-[10px] tracking-widest uppercase font-body">
                      Coming Soon
                    </p>
                    <div style={{ width: "32px", height: "1px", backgroundColor: "#3A3A3C" }} />
                  </div>

                  {/* Hover overlay */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ backgroundColor: "#C4956A15" }}
                  />

                  {/* Quick add bar */}
                  <div
                    className="absolute bottom-0 left-0 right-0 flex items-center justify-center py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                    style={{ backgroundColor: "#C4956A" }}
                  >
                    <p className="text-white text-[11px] tracking-widest uppercase font-body">
                      Quick Add
                    </p>
                  </div>
                </div>

                {/* Info */}
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[#6E6860] text-[10px] tracking-widest uppercase font-body mb-1">
                      Rocksware
                    </p>
                    <h4 className="font-display text-[#F5F0E8] text-lg">
                      {item.name}
                    </h4>
                  </div>
                  <p className="text-[#C4956A] font-body text-sm font-medium mt-1">
                    KES {item.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY ROCKSWARE ────────────────────────────────────────────── */}
      <section className="section-padding py-28">
        <div className="container-narrow">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-3">
              <div className="w-6 h-px bg-[#C4956A]" />
              <p className="text-[#C4956A] text-[10px] tracking-[0.35em] uppercase font-body">
                Why Us
              </p>
              <div className="w-6 h-px bg-[#C4956A]" />
            </div>
            <h2 className="font-display text-5xl text-[#0A0A0A]">
              The Rocksware Promise
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-1">
            {[
              {
                number: "01",
                title: "Authentic Quality",
                desc: "Every pair curated for quality, comfort, and longevity. No compromises.",
              },
              {
                number: "02",
                title: "Pay Your Way",
                desc: "M-Pesa, Airtel Money, or Visa. Checkout the way that works for you.",
              },
              {
                number: "03",
                title: "Nairobi Delivery",
                desc: "Same-day delivery within Nairobi. Countrywide shipping available.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  padding: "48px 40px",
                  borderTop: "2px solid #0A0A0A",
                  position: "relative",
                }}
                className="group hover:bg-[#0A0A0A] transition-colors duration-300"
              >
                <p
                  style={{
                    fontFamily: "Georgia, serif",
                    fontSize: "64px",
                    color: "#F5F0E8",
                    lineHeight: 1,
                    marginBottom: "24px",
                    transition: "color 0.3s",
                  }}
                  className="group-hover:text-[#C4956A]"
                >
                  {item.number}
                </p>
                <h3
                  className="font-display text-2xl text-[#0A0A0A] mb-3 group-hover:text-[#F5F0E8] transition-colors duration-300"
                >
                  {item.title}
                </h3>
                <p className="text-[#6E6860] font-body font-light text-sm leading-relaxed group-hover:text-[#B5AFA6] transition-colors duration-300">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────── */}
      <section
        className="section-padding py-28"
        style={{ backgroundColor: "#0A0A0A", borderTop: "1px solid #1C1C1E" }}
      >
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 h-px bg-[#C4956A]" />
                <p className="text-[#C4956A] text-[10px] tracking-[0.35em] uppercase font-body">
                  Ready?
                </p>
              </div>
              <h2 className="font-display text-5xl md:text-6xl text-[#F5F0E8] leading-tight">
                Your Next Pair<br />
                <em className="text-[#C4956A] not-italic">Awaits</em>
              </h2>
            </div>
            <div className="flex flex-col gap-5 md:items-end">
              <p className="text-[#6E6860] font-body font-light text-sm leading-relaxed max-w-sm md:text-right">
                Join thousands of Kenyans who trust Rocksware for premium footwear delivered to their door.
              </p>
              <div className="flex gap-4">
                <Link href="/shop" className="btn-cognac">
                  Start Shopping
                </Link>
                <Link href="/auth/register"
                  style={{
                    border: "1px solid #3A3A3C",
                    color: "#F5F0E8",
                    padding: "12px 32px",
                    fontSize: "13px",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    fontFamily: "Jost, sans-serif",
                    transition: "all 0.3s ease",
                    display: "inline-block",
                  }}
                >
                  Join Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
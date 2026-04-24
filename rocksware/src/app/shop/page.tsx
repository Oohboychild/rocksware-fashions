"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Shoe, ShoeCategory } from "@/types";
import { SlidersHorizontal, X, ChevronDown, ShoppingBag } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import toast from "react-hot-toast";

const categories: { label: string; value: ShoeCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Sneakers", value: "sneakers" },
  { label: "Heels", value: "heels" },
  { label: "Boots", value: "boots" },
  { label: "Loafers", value: "loafers" },
  { label: "Sandals", value: "sandals" },
  { label: "Formal", value: "formal" },
  { label: "Kids", value: "kids" },
];

const sortOptions = [
  { label: "Newest First", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
];

export default function ShopPage() {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") as ShoeCategory | null;

  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [filtered, setFiltered] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ShoeCategory | "all">(
    categoryParam || "all"
  );
  const [sortBy, setSortBy] = useState("newest");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(50000);
  const [sortOpen, setSortOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    const fetchShoes = async () => {
      try {
        setLoading(true);
        const ref = collection(db, "shoes");
        const q = query(ref, orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Shoe[];
        setShoes(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShoes();
  }, []);

  useEffect(() => {
    let result = [...shoes];
    if (activeCategory !== "all") {
      result = result.filter((s) => s.category === activeCategory);
    }
    result = result.filter((s) => s.price <= maxPrice);
    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    setFiltered(result);
  }, [shoes, activeCategory, sortBy, maxPrice]);

  const handleQuickAdd = (shoe: Shoe) => {
    if (!shoe.sizes?.length) return;
    addItem(shoe, shoe.sizes[0], shoe.colors?.[0] || "Default");
    toast.success(`${shoe.name} added to cart`);
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5F0E8" }}>

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div style={{ backgroundColor: "#0A0A0A", padding: "80px 0 60px" }}>
        <div className="section-padding">
          <div className="container-narrow">
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
              <div style={{ width: "24px", height: "1px", backgroundColor: "#C4956A" }} />
              <p style={{
                color: "#C4956A",
                fontSize: "10px",
                letterSpacing: "0.35em",
                textTransform: "uppercase",
                fontFamily: "Jost, sans-serif",
              }}>
                {activeCategory === "all" ? "Everything" : activeCategory}
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
              <h1 style={{
                fontFamily: "Georgia, serif",
                fontSize: "clamp(48px, 8vw, 80px)",
                color: "#F5F0E8",
                lineHeight: 0.95,
                fontWeight: 400,
              }}>
                {activeCategory === "all"
                  ? "All Shoes"
                  : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
              </h1>
              <p style={{
                color: "#3A3A3C",
                fontFamily: "Jost, sans-serif",
                fontSize: "13px",
                letterSpacing: "0.05em",
                paddingBottom: "8px",
              }}>
                {filtered.length} {filtered.length === 1 ? "style" : "styles"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Toolbar ─────────────────────────────────────────────────── */}
      <div style={{
        borderBottom: "1px solid #EDE8E0",
        backgroundColor: "#F5F0E8",
        position: "sticky",
        top: "72px",
        zIndex: 30,
      }}>
        <div className="section-padding">
          <div className="container-narrow">
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "56px",
              gap: "16px",
            }}>

              {/* Category pills — scrollable on mobile */}
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "4px",
                overflowX: "auto",
                flex: 1,
                paddingBottom: "2px",
                msOverflowStyle: "none",
                scrollbarWidth: "none",
              }}>
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setActiveCategory(cat.value)}
                    style={{
                      padding: "6px 16px",
                      fontSize: "11px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontFamily: "Jost, sans-serif",
                      fontWeight: 400,
                      whiteSpace: "nowrap",
                      border: "none",
                      cursor: "pointer",
                      transition: "all 0.2s",
                      backgroundColor: activeCategory === cat.value ? "#0A0A0A" : "transparent",
                      color: activeCategory === cat.value ? "#F5F0E8" : "#6E6860",
                    }}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Right controls */}
              <div style={{ display: "flex", alignItems: "center", gap: "20px", flexShrink: 0 }}>

                {/* Filter */}
                <button
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "11px",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontFamily: "Jost, sans-serif",
                    color: filtersOpen ? "#C4956A" : "#6E6860",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  <SlidersHorizontal size={13} />
                  Filter
                </button>

                {/* Divider */}
                <div style={{ width: "1px", height: "14px", backgroundColor: "#EDE8E0" }} />

                {/* Sort */}
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => setSortOpen(!sortOpen)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      fontSize: "11px",
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontFamily: "Jost, sans-serif",
                      color: "#6E6860",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: 0,
                    }}
                  >
                    Sort
                    <ChevronDown size={13} style={{ transform: sortOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
                  </button>

                  {sortOpen && (
                    <div style={{
                      position: "absolute",
                      right: 0,
                      top: "32px",
                      backgroundColor: "#0A0A0A",
                      minWidth: "200px",
                      zIndex: 50,
                      boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                    }}>
                      {sortOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                          style={{
                            display: "block",
                            width: "100%",
                            textAlign: "left",
                            padding: "14px 20px",
                            fontSize: "11px",
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            fontFamily: "Jost, sans-serif",
                            backgroundColor: "transparent",
                            border: "none",
                            cursor: "pointer",
                            color: sortBy === opt.value ? "#C4956A" : "#6E6860",
                            borderBottom: "1px solid #1C1C1E",
                            transition: "color 0.2s",
                          }}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filter Panel ────────────────────────────────────────────── */}
      {filtersOpen && (
        <div style={{
          backgroundColor: "#0A0A0A",
          padding: "32px 0",
          borderBottom: "1px solid #1C1C1E",
        }}>
          <div className="section-padding">
            <div className="container-narrow">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <p style={{
                  fontSize: "10px",
                  letterSpacing: "0.25em",
                  textTransform: "uppercase",
                  fontFamily: "Jost, sans-serif",
                  color: "#C4956A",
                }}>
                  Max Price — KES {maxPrice.toLocaleString()}
                </p>
                <button
                  onClick={() => setFiltersOpen(false)}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#6E6860", padding: 0 }}
                >
                  <X size={16} />
                </button>
              </div>
              <div style={{ maxWidth: "400px" }}>
                <input
                  type="range"
                  min={500}
                  max={50000}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  style={{ width: "100%", accentColor: "#C4956A" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "6px" }}>
                  <span style={{ fontSize: "10px", color: "#3A3A3C", fontFamily: "Jost, sans-serif" }}>KES 500</span>
                  <span style={{ fontSize: "10px", color: "#3A3A3C", fontFamily: "Jost, sans-serif" }}>KES 50,000</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Product Grid ─────────────────────────────────────────────── */}
      <div className="section-padding" style={{ paddingTop: "48px", paddingBottom: "80px" }}>
        <div className="container-narrow">

          {/* Loading skeleton */}
          {loading && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
              gap: "2px",
            }}>
              {Array(8).fill(null).map((_, i) => (
                <div key={i} style={{ animation: "pulse 1.5s infinite" }}>
                  <div style={{ backgroundColor: "#EDE8E0", aspectRatio: "3/4", marginBottom: "12px" }} />
                  <div style={{ backgroundColor: "#EDE8E0", height: "10px", width: "60px", marginBottom: "8px" }} />
                  <div style={{ backgroundColor: "#EDE8E0", height: "14px", width: "120px", marginBottom: "8px" }} />
                  <div style={{ backgroundColor: "#EDE8E0", height: "10px", width: "80px" }} />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && filtered.length === 0 && (
            <div style={{ textAlign: "center", paddingTop: "80px", paddingBottom: "80px" }}>
              <div style={{
                width: "64px",
                height: "64px",
                border: "1px solid #EDE8E0",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 24px",
              }}>
                <ShoppingBag size={24} strokeWidth={1} style={{ color: "#B5AFA6" }} />
              </div>
              <h2 style={{
                fontFamily: "Georgia, serif",
                fontSize: "32px",
                color: "#0A0A0A",
                marginBottom: "12px",
                fontWeight: 400,
              }}>
                No styles found
              </h2>
              <p style={{
                color: "#6E6860",
                fontFamily: "Jost, sans-serif",
                fontSize: "14px",
                marginBottom: "32px",
                fontWeight: 300,
              }}>
                Try adjusting your filters or check back soon for new arrivals.
              </p>
              <button
                onClick={() => { setActiveCategory("all"); setMaxPrice(50000); }}
                style={{
                  border: "1px solid #0A0A0A",
                  backgroundColor: "transparent",
                  color: "#0A0A0A",
                  padding: "12px 32px",
                  fontSize: "11px",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  fontFamily: "Jost, sans-serif",
                  cursor: "pointer",
                  transition: "all 0.3s",
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

          {/* Products */}
          {!loading && filtered.length > 0 && (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "40px 24px",
            }}>
              {filtered.map((shoe) => (
                <div
                  key={shoe.id}
                  onMouseEnter={() => setHoveredId(shoe.id)}
                  onMouseLeave={() => setHoveredId(null)}
                >
                  {/* Image */}
                  <Link href={`/product/${shoe.id}`} style={{ textDecoration: "none", display: "block" }}>
                    <div style={{
                      position: "relative",
                      backgroundColor: "#EDE8E0",
                      aspectRatio: "3/4",
                      marginBottom: "16px",
                      overflow: "hidden",
                    }}>
                      {shoe.images?.[0] ? (
                        <img
                          src={shoe.images[0]}
                          alt={shoe.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            transform: hoveredId === shoe.id ? "scale(1.05)" : "scale(1)",
                            transition: "transform 0.6s ease",
                          }}
                        />
                      ) : (
                        <div style={{
                          width: "100%",
                          height: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                        }}>
                          <div style={{ width: "24px", height: "1px", backgroundColor: "#B5AFA6" }} />
                          <p style={{
                            color: "#B5AFA6",
                            fontSize: "10px",
                            letterSpacing: "0.3em",
                            textTransform: "uppercase",
                            fontFamily: "Jost, sans-serif",
                          }}>
                            Rocksware
                          </p>
                          <div style={{ width: "24px", height: "1px", backgroundColor: "#B5AFA6" }} />
                        </div>
                      )}

                      {/* Featured badge */}
                      {shoe.featured && (
                        <div style={{
                          position: "absolute",
                          top: "12px",
                          left: "12px",
                          backgroundColor: "#C4956A",
                          color: "white",
                          fontSize: "9px",
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          fontFamily: "Jost, sans-serif",
                          padding: "4px 10px",
                        }}>
                          New In
                        </div>
                      )}

                      {/* Out of stock overlay */}
                      {shoe.stock === 0 && (
                        <div style={{
                          position: "absolute",
                          inset: 0,
                          backgroundColor: "rgba(245,240,232,0.7)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}>
                          <p style={{
                            fontSize: "10px",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            fontFamily: "Jost, sans-serif",
                            color: "#6E6860",
                          }}>
                            Sold Out
                          </p>
                        </div>
                      )}

                      {/* Quick add */}
                      {shoe.stock > 0 && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            handleQuickAdd(shoe);
                          }}
                          style={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: "#0A0A0A",
                            color: "#F5F0E8",
                            border: "none",
                            padding: "14px",
                            fontSize: "10px",
                            letterSpacing: "0.2em",
                            textTransform: "uppercase",
                            fontFamily: "Jost, sans-serif",
                            cursor: "pointer",
                            transform: hoveredId === shoe.id ? "translateY(0)" : "translateY(100%)",
                            transition: "transform 0.3s ease, background-color 0.2s",
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#C4956A")}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#0A0A0A")}
                        >
                          Quick Add
                        </button>
                      )}
                    </div>
                  </Link>

                  {/* Info */}
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "8px" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{
                        color: "#B5AFA6",
                        fontSize: "9px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        fontFamily: "Jost, sans-serif",
                        marginBottom: "4px",
                      }}>
                        {shoe.brand}
                      </p>
                      <Link href={`/product/${shoe.id}`} style={{ textDecoration: "none" }}>
                        <h3 style={{
                          fontFamily: "Georgia, serif",
                          fontSize: "18px",
                          color: "#0A0A0A",
                          fontWeight: 400,
                          marginBottom: "4px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}>
                          {shoe.name}
                        </h3>
                      </Link>

                      {/* Sizes preview */}
                      {shoe.sizes?.length > 0 && (
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", marginTop: "6px" }}>
                          {shoe.sizes.slice(0, 4).map((size) => (
                            <span key={size} style={{
                              fontSize: "9px",
                              color: "#B5AFA6",
                              fontFamily: "Jost, sans-serif",
                              border: "1px solid #EDE8E0",
                              padding: "2px 6px",
                            }}>
                              {size}
                            </span>
                          ))}
                          {shoe.sizes.length > 4 && (
                            <span style={{ fontSize: "9px", color: "#B5AFA6", fontFamily: "Jost, sans-serif" }}>
                              +{shoe.sizes.length - 4}
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Price */}
                    <p style={{
                      fontFamily: "Jost, sans-serif",
                      fontSize: "14px",
                      color: "#0A0A0A",
                      fontWeight: 500,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}>
                      KES {shoe.price.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Shoe, ShoeCategory } from "@/types";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
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
  { label: "Newest", value: "newest" },
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

  const addItem = useCartStore((s) => s.addItem);

  // Fetch shoes from Firestore
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

  // Filter + sort
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
    if (shoe.sizes.length === 0) return;
    addItem(shoe, shoe.sizes[0], shoe.colors[0] || "Default");
    toast.success(`${shoe.name} added to cart`);
  };

  return (
    <div className="min-h-screen">

      {/* ── Page Header ─────────────────────────────────────────────── */}
      <div className="bg-[#0A0A0A] section-padding py-16">
        <div className="container-narrow">
          <p className="text-[#C4956A] text-xs tracking-[0.3em] uppercase font-body mb-3">
            {activeCategory === "all" ? "Everything" : activeCategory}
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-[#F5F0E8]">
            {activeCategory === "all" ? "All Shoes" : activeCategory.charAt(0).toUpperCase() + activeCategory.slice(1)}
          </h1>
          <p className="text-[#6E6860] font-body text-sm mt-3">
            {filtered.length} {filtered.length === 1 ? "style" : "styles"} available
          </p>
        </div>
      </div>

      <div className="section-padding py-10">
        <div className="container-narrow">

          {/* ── Toolbar ─────────────────────────────────────────────── */}
          <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">

            {/* Category pills */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-4 py-2 text-xs tracking-widest uppercase font-body border transition-colors duration-200 ${
                    activeCategory === cat.value
                      ? "bg-[#0A0A0A] text-[#F5F0E8] border-[#0A0A0A]"
                      : "bg-transparent text-[#6E6860] border-[#EDE8E0] hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-4">
              {/* Filter button */}
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="flex items-center gap-2 text-xs tracking-widest uppercase font-body text-[#6E6860] hover:text-[#0A0A0A] transition-colors"
              >
                <SlidersHorizontal size={14} />
                Filter
              </button>

              {/* Sort dropdown */}
              <div className="relative">
                <button
                  onClick={() => setSortOpen(!sortOpen)}
                  className="flex items-center gap-2 text-xs tracking-widest uppercase font-body text-[#6E6860] hover:text-[#0A0A0A] transition-colors"
                >
                  Sort
                  <ChevronDown size={14} />
                </button>
                {sortOpen && (
                  <div className="absolute right-0 top-8 bg-white border border-[#EDE8E0] shadow-lg z-20 min-w-[180px]">
                    {sortOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => { setSortBy(opt.value); setSortOpen(false); }}
                        className={`block w-full text-left px-4 py-3 text-xs tracking-wide font-body hover:bg-[#F7F4F0] transition-colors ${
                          sortBy === opt.value ? "text-[#C4956A]" : "text-[#2C2825]"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Filter Panel ────────────────────────────────────────── */}
          {filtersOpen && (
            <div className="bg-[#F7F4F0] border border-[#EDE8E0] p-6 mb-8 relative">
              <button
                onClick={() => setFiltersOpen(false)}
                className="absolute top-4 right-4 text-[#6E6860] hover:text-[#0A0A0A]"
              >
                <X size={16} />
              </button>
              <div className="max-w-sm">
                <p className="text-xs tracking-widest uppercase font-body text-[#6E6860] mb-4">
                  Max Price: KES {maxPrice.toLocaleString()}
                </p>
                <input
                  type="range"
                  min={500}
                  max={50000}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-[#C4956A]"
                />
                <div className="flex justify-between text-[10px] text-[#B5AFA6] font-body mt-1">
                  <span>KES 500</span>
                  <span>KES 50,000</span>
                </div>
              </div>
            </div>
          )}

          {/* ── Products Grid ────────────────────────────────────────── */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(8).fill(null).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-[#EDE8E0] aspect-[3/4] mb-4" />
                  <div className="bg-[#EDE8E0] h-3 w-16 mb-2" />
                  <div className="bg-[#EDE8E0] h-4 w-32 mb-2" />
                  <div className="bg-[#EDE8E0] h-3 w-20" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-32">
              <p className="font-display text-3xl text-[#0A0A0A] mb-4">No styles found</p>
              <p className="text-[#6E6860] font-body text-sm mb-8">
                Try adjusting your filters or check back soon for new arrivals.
              </p>
              <button
                onClick={() => { setActiveCategory("all"); setMaxPrice(50000); }}
                className="btn-outline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-12">
              {filtered.map((shoe) => (
                <div key={shoe.id} className="group">
                  {/* Image */}
                  <Link href={`/product/${shoe.id}`}>
                    <div className="relative bg-[#EDE8E0] aspect-[3/4] mb-4 overflow-hidden">
                      {shoe.images?.[0] ? (
                        <img
                          src={shoe.images[0]}
                          alt={shoe.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <p className="text-[#B5AFA6] text-xs tracking-widest uppercase font-body">
                            Rocksware
                          </p>
                        </div>
                      )}

                      {/* Featured badge */}
                      {shoe.featured && (
                        <span className="absolute top-3 left-3 bg-[#C4956A] text-white text-[10px] tracking-widest uppercase px-2 py-1 font-body">
                          New In
                        </span>
                      )}

                      {/* Quick add */}
                      <button
                        onClick={() => handleQuickAdd(shoe)}
                        className="absolute bottom-0 left-0 right-0 bg-[#0A0A0A] text-[#F5F0E8] py-3 text-xs tracking-widest uppercase font-body translate-y-full group-hover:translate-y-0 transition-transform duration-300 hover:bg-[#C4956A]"
                      >
                        Quick Add
                      </button>
                    </div>
                  </Link>

                  {/* Info */}
                  <p className="text-[#B5AFA6] text-[10px] tracking-widest uppercase font-body mb-1">
                    {shoe.brand}
                  </p>
                  <Link href={`/product/${shoe.id}`}>
                    <h3 className="font-display text-[#0A0A0A] text-lg hover:text-[#C4956A] transition-colors mb-1">
                      {shoe.name}
                    </h3>
                  </Link>
                  <p className="text-[#2C2825] font-body text-sm font-medium">
                    KES {shoe.price.toLocaleString()}
                  </p>

                  {/* Sizes preview */}
                  {shoe.sizes?.length > 0 && (
                    <div className="flex gap-1 mt-2 flex-wrap">
                      {shoe.sizes.slice(0, 4).map((size) => (
                        <span key={size} className="text-[10px] text-[#B5AFA6] font-body border border-[#EDE8E0] px-1.5 py-0.5">
                          {size}
                        </span>
                      ))}
                      {shoe.sizes.length > 4 && (
                        <span className="text-[10px] text-[#B5AFA6] font-body">
                          +{shoe.sizes.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
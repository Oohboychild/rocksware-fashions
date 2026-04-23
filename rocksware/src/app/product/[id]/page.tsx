"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Shoe } from "@/types";
import { useCartStore } from "@/store/cartStore";
import { ShoppingBag, ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();

  const [shoe, setShoe] = useState<Shoe | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    const fetchShoe = async () => {
      try {
        const ref = doc(db, "shoes", id as string);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = { id: snap.id, ...snap.data() } as Shoe;
          setShoe(data);
          setSelectedColor(data.colors?.[0] || null);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShoe();
  }, [id]);

  const handleAddToCart = () => {
    if (!shoe) return;
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a colour");
      return;
    }
    addItem(shoe, selectedSize, selectedColor);
    setAdded(true);
    toast.success(`${shoe.name} added to cart`);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="section-padding py-16">
        <div className="container-narrow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 animate-pulse">
            <div className="bg-[#EDE8E0] aspect-square" />
            <div className="space-y-4">
              <div className="bg-[#EDE8E0] h-4 w-24" />
              <div className="bg-[#EDE8E0] h-10 w-64" />
              <div className="bg-[#EDE8E0] h-6 w-32" />
              <div className="bg-[#EDE8E0] h-24 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!shoe) {
    return (
      <div className="section-padding py-32 text-center">
        <h2 className="font-display text-4xl text-[#0A0A0A] mb-4">
          Product not found
        </h2>
        <p className="text-[#6E6860] font-body text-sm mb-8">
          This product may have been removed or is no longer available.
        </p>
        <Link href="/shop" className="btn-primary">
          Back to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="section-padding py-10">
        <div className="container-narrow">

          {/* Back link */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-xs tracking-widest uppercase font-body text-[#6E6860] hover:text-[#0A0A0A] transition-colors mb-10"
          >
            <ArrowLeft size={14} />
            Back
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

            {/* ── Images ─────────────────────────────────────────────── */}
            <div className="flex gap-4">
              {/* Thumbnails */}
              {shoe.images?.length > 1 && (
                <div className="flex flex-col gap-3 w-16 shrink-0">
                  {shoe.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`aspect-square bg-[#EDE8E0] overflow-hidden border-2 transition-colors ${
                        activeImage === i
                          ? "border-[#C4956A]"
                          : "border-transparent"
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${shoe.name} view ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div className="flex-1 bg-[#EDE8E0] aspect-square relative overflow-hidden">
                {shoe.images?.[activeImage] ? (
                  <img
                    src={shoe.images[activeImage]}
                    alt={shoe.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <p className="text-[#B5AFA6] text-xs tracking-widest uppercase font-body">
                      Rocksware
                    </p>
                  </div>
                )}
                {shoe.featured && (
                  <span className="absolute top-4 left-4 bg-[#C4956A] text-white text-[10px] tracking-widest uppercase px-2 py-1 font-body">
                    New In
                  </span>
                )}
              </div>
            </div>

            {/* ── Details ────────────────────────────────────────────── */}
            <div className="flex flex-col">

              {/* Brand + category */}
              <div className="flex items-center gap-3 mb-3">
                <p className="text-[#B5AFA6] text-xs tracking-widest uppercase font-body">
                  {shoe.brand}
                </p>
                <span className="text-[#EDE8E0]">·</span>
                <p className="text-[#C4956A] text-xs tracking-widest uppercase font-body">
                  {shoe.category}
                </p>
              </div>

              {/* Name */}
              <h1 className="font-display text-4xl md:text-5xl text-[#0A0A0A] mb-4 leading-tight">
                {shoe.name}
              </h1>

              {/* Price */}
              <p className="font-body text-2xl text-[#0A0A0A] font-medium mb-6">
                KES {shoe.price.toLocaleString()}
              </p>

              {/* Description */}
              <p className="text-[#6E6860] font-body font-light text-sm leading-relaxed mb-8 border-t border-b border-[#EDE8E0] py-6">
                {shoe.description}
              </p>

              {/* Colours */}
              {shoe.colors?.length > 0 && (
                <div className="mb-6">
                  <p className="text-xs tracking-widest uppercase font-body text-[#6E6860] mb-3">
                    Colour — <span className="text-[#0A0A0A]">{selectedColor}</span>
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {shoe.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 text-xs tracking-wide font-body border transition-colors ${
                          selectedColor === color
                            ? "bg-[#0A0A0A] text-[#F5F0E8] border-[#0A0A0A]"
                            : "bg-transparent text-[#6E6860] border-[#EDE8E0] hover:border-[#0A0A0A]"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {shoe.sizes?.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs tracking-widest uppercase font-body text-[#6E6860]">
                      Size — <span className="text-[#0A0A0A]">{selectedSize ? `EU ${selectedSize}` : "Select"}</span>
                    </p>
                    <button className="text-xs font-body text-[#C4956A] underline underline-offset-2">
                      Size Guide
                    </button>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {shoe.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 text-xs font-body border transition-colors ${
                          selectedSize === size
                            ? "bg-[#0A0A0A] text-[#F5F0E8] border-[#0A0A0A]"
                            : "bg-transparent text-[#6E6860] border-[#EDE8E0] hover:border-[#0A0A0A] hover:text-[#0A0A0A]"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock warning */}
              {shoe.stock <= 5 && shoe.stock > 0 && (
                <p className="text-[#C4956A] text-xs font-body tracking-wide mb-4">
                  Only {shoe.stock} left in stock
                </p>
              )}
              {shoe.stock === 0 && (
                <p className="text-red-400 text-xs font-body tracking-wide mb-4">
                  Out of stock
                </p>
              )}

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                disabled={shoe.stock === 0}
                className={`flex items-center justify-center gap-3 py-4 text-sm tracking-widest uppercase font-body transition-colors duration-300 ${
                  shoe.stock === 0
                    ? "bg-[#EDE8E0] text-[#B5AFA6] cursor-not-allowed"
                    : added
                    ? "bg-[#C4956A] text-white"
                    : "bg-[#0A0A0A] text-[#F5F0E8] hover:bg-[#C4956A]"
                }`}
              >
                {added ? (
                  <>
                    <Check size={16} />
                    Added to Cart
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    Add to Cart
                  </>
                )}
              </button>

              {/* Go to checkout */}
              {added && (
                <Link
                  href="/cart"
                  className="mt-3 text-center text-xs tracking-widest uppercase font-body text-[#6E6860] hover:text-[#0A0A0A] transition-colors underline underline-offset-2"
                >
                  View Cart →
                </Link>
              )}

              {/* Trust badges */}
              <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-[#EDE8E0]">
                {[
                  { title: "Free Returns", desc: "Within 7 days" },
                  { title: "Authenticity", desc: "100% guaranteed" },
                  { title: "Secure Pay", desc: "M-Pesa · Visa" },
                ].map((badge) => (
                  <div key={badge.title} className="text-center">
                    <p className="font-body text-xs text-[#0A0A0A] font-medium mb-1">
                      {badge.title}
                    </p>
                    <p className="font-body text-[10px] text-[#B5AFA6]">
                      {badge.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
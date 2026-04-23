"use client";

import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, removeItem, updateQuantity, total, clearCart } = useCartStore();
  const cartTotal = total();

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center section-padding text-center">
        <div className="w-16 h-16 border border-[#EDE8E0] rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={24} strokeWidth={1.5} className="text-[#B5AFA6]" />
        </div>
        <h2 className="font-display text-4xl text-[#0A0A0A] mb-3">
          Your cart is empty
        </h2>
        <p className="text-[#6E6860] font-body text-sm mb-8 max-w-sm">
          Looks like you haven't added anything yet. Browse our collection and find your perfect pair.
        </p>
        <Link href="/shop" className="btn-primary">
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen">

      {/* Header */}
      <div className="bg-[#0A0A0A] section-padding py-16">
        <div className="container-narrow">
          <p className="text-[#C4956A] text-xs tracking-[0.3em] uppercase font-body mb-3">
            Your Selection
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-[#F5F0E8]">
            Shopping Cart
          </h1>
          <p className="text-[#6E6860] font-body text-sm mt-3">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>
      </div>

      <div className="section-padding py-12">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* ── Cart Items ──────────────────────────────────────────── */}
            <div className="lg:col-span-2">

              {/* Column headers */}
              <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-[#EDE8E0] mb-6">
                <p className="col-span-6 text-xs tracking-widest uppercase font-body text-[#B5AFA6]">
                  Product
                </p>
                <p className="col-span-2 text-xs tracking-widest uppercase font-body text-[#B5AFA6] text-center">
                  Size
                </p>
                <p className="col-span-2 text-xs tracking-widest uppercase font-body text-[#B5AFA6] text-center">
                  Qty
                </p>
                <p className="col-span-2 text-xs tracking-widest uppercase font-body text-[#B5AFA6] text-right">
                  Total
                </p>
              </div>

              {/* Items */}
              <div className="space-y-6">
                {items.map((item) => (
                  <div
                    key={`${item.shoe.id}-${item.size}-${item.color}`}
                    className="grid grid-cols-12 gap-4 items-center pb-6 border-b border-[#EDE8E0]"
                  >
                    {/* Image + Info */}
                    <div className="col-span-12 md:col-span-6 flex gap-4 items-start">
                      <Link href={`/product/${item.shoe.id}`}>
                        <div className="w-20 h-24 bg-[#EDE8E0] shrink-0 overflow-hidden">
                          {item.shoe.images?.[0] ? (
                            <img
                              src={item.shoe.images[0]}
                              alt={item.shoe.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <p className="text-[10px] text-[#B5AFA6] font-body">
                                RW
                              </p>
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <p className="text-[#B5AFA6] text-[10px] tracking-widest uppercase font-body mb-1">
                          {item.shoe.brand}
                        </p>
                        <Link href={`/product/${item.shoe.id}`}>
                          <h3 className="font-display text-lg text-[#0A0A0A] hover:text-[#C4956A] transition-colors leading-tight mb-1">
                            {item.shoe.name}
                          </h3>
                        </Link>
                        <p className="text-[#6E6860] text-xs font-body">
                          {item.color}
                        </p>
                        <p className="text-[#0A0A0A] font-body text-sm font-medium mt-1 md:hidden">
                          KES {item.shoe.price.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Size */}
                    <div className="col-span-4 md:col-span-2 text-center">
                      <span className="text-xs font-body text-[#2C2825] border border-[#EDE8E0] px-3 py-1.5">
                        EU {item.size}
                      </span>
                    </div>

                    {/* Quantity */}
                    <div className="col-span-5 md:col-span-2 flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          if (item.quantity === 1) {
                            removeItem(item.shoe.id, item.size, item.color);
                            toast.success("Item removed");
                          } else {
                            updateQuantity(item.shoe.id, item.size, item.color, item.quantity - 1);
                          }
                        }}
                        className="w-7 h-7 border border-[#EDE8E0] flex items-center justify-center hover:border-[#0A0A0A] transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-body w-6 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.shoe.id, item.size, item.color, item.quantity + 1)
                        }
                        className="w-7 h-7 border border-[#EDE8E0] flex items-center justify-center hover:border-[#0A0A0A] transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>

                    {/* Total + Remove */}
                    <div className="col-span-3 md:col-span-2 flex flex-col items-end gap-2">
                      <p className="font-body text-sm font-medium text-[#0A0A0A]">
                        KES {(item.shoe.price * item.quantity).toLocaleString()}
                      </p>
                      <button
                        onClick={() => {
                          removeItem(item.shoe.id, item.size, item.color);
                          toast.success("Item removed");
                        }}
                        className="text-[#B5AFA6] hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clear cart */}
              <button
                onClick={() => {
                  clearCart();
                  toast.success("Cart cleared");
                }}
                className="mt-6 text-xs tracking-widest uppercase font-body text-[#B5AFA6] hover:text-red-400 transition-colors"
              >
                Clear Cart
              </button>
            </div>

            {/* ── Order Summary ───────────────────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="bg-[#F7F4F0] p-8 sticky top-24">
                <h2 className="font-display text-2xl text-[#0A0A0A] mb-6">
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-[#6E6860]">Subtotal</span>
                    <span className="text-[#0A0A0A]">KES {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-[#6E6860]">Delivery</span>
                    <span className="text-[#C4956A]">Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-[#EDE8E0] pt-4 mb-8">
                  <div className="flex justify-between font-body">
                    <span className="text-sm text-[#0A0A0A] font-medium">Total</span>
                    <span className="text-lg text-[#0A0A0A] font-medium">
                      KES {cartTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="flex items-center justify-center gap-3 w-full bg-[#0A0A0A] text-[#F5F0E8] py-4 text-sm tracking-widest uppercase font-body hover:bg-[#C4956A] transition-colors duration-300"
                >
                  Checkout
                  <ArrowRight size={16} />
                </Link>

                <Link
                  href="/shop"
                  className="block text-center mt-4 text-xs tracking-widest uppercase font-body text-[#6E6860] hover:text-[#0A0A0A] transition-colors"
                >
                  ← Continue Shopping
                </Link>

                {/* Payment methods */}
                <div className="mt-8 pt-6 border-t border-[#EDE8E0]">
                  <p className="text-[10px] tracking-widest uppercase font-body text-[#B5AFA6] mb-3 text-center">
                    We Accept
                  </p>
                  <div className="flex justify-center gap-2">
                    {["M-Pesa", "Airtel", "Visa"].map((p) => (
                      <span
                        key={p}
                        className="border border-[#EDE8E0] text-[#6E6860] text-[10px] px-2 py-1 font-body tracking-wide"
                      >
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
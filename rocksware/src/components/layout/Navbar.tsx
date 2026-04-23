"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, User, Menu, X, Search } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const count = useCartStore((s) => s.count)();
  const { user } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;

  const links = [
    { label: "Shop", href: "/shop" },
    { label: "Sneakers", href: "/shop?category=sneakers" },
    { label: "Heels", href: "/shop?category=heels" },
    { label: "Boots", href: "/shop?category=boots" },
    { label: "New In", href: "/shop?featured=true" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#F5F0E8] shadow-sm border-b border-[#EDE8E0]"
            : "bg-[#F5F0E8]/95 backdrop-blur-sm"
        }`}
      >
        <div className="section-padding">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Left — nav links desktop */}
            <div className="hidden md:flex items-center gap-8">
              {links.slice(0, 3).map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-xs tracking-widest uppercase text-[#2C2825] hover:text-[#C4956A] transition-colors duration-200"
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Centre — logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 font-display text-2xl md:text-3xl tracking-[0.15em] text-[#0A0A0A] uppercase"
            >
              Rocksware
            </Link>

            {/* Right — icons */}
            <div className="flex items-center gap-5 ml-auto">
              <button className="hidden md:block text-[#2C2825] hover:text-[#C4956A] transition-colors">
                <Search size={18} strokeWidth={1.5} />
              </button>

              <Link
                href={user ? "/account" : "/auth/login"}
                className="hidden md:block text-[#2C2825] hover:text-[#C4956A] transition-colors"
              >
                <User size={18} strokeWidth={1.5} />
              </Link>

              <Link href="/cart" className="relative text-[#2C2825] hover:text-[#C4956A] transition-colors">
                <ShoppingBag size={18} strokeWidth={1.5} />
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#C4956A] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-body">
                    {count}
                  </span>
                )}
              </Link>

              {/* Mobile menu button */}
              <button
                className="md:hidden text-[#2C2825]"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden bg-[#F5F0E8] border-t border-[#EDE8E0] px-6 py-6 flex flex-col gap-5">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                className="text-xs tracking-widest uppercase text-[#2C2825] hover:text-[#C4956A] transition-colors"
              >
                {l.label}
              </Link>
            ))}
            <div className="border-t border-[#EDE8E0] pt-5 flex flex-col gap-4">
              <Link
                href={user ? "/account" : "/auth/login"}
                onClick={() => setMenuOpen(false)}
                className="text-xs tracking-widest uppercase text-[#2C2825] hover:text-[#C4956A] transition-colors"
              >
                {user ? "My Account" : "Sign In"}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-16 md:h-20" />
    </>
  );
}
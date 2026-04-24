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
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const count = useCartStore((s) => s.count)();
  const { user } = useAuthStore();

  useEffect(() => {
    setMounted(true);
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
    { label: "Loafers", href: "/shop?category=loafers" },
    { label: "New In", href: "/shop?featured=true" },
  ];

  const navLinkStyle = (href: string) => ({
    fontSize: "11px",
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    fontFamily: "Jost, sans-serif",
    fontWeight: 400,
    color: pathname === href ? "#C4956A" : "#2C2825",
    textDecoration: "none",
    transition: "color 0.2s",
    whiteSpace: "nowrap" as const,
  });

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backgroundColor: scrolled ? "#F5F0E8" : "rgba(245, 240, 232, 0.97)",
          backdropFilter: "blur(8px)",
          borderBottom: scrolled ? "1px solid #EDE8E0" : "none",
          transition: "all 0.3s ease",
        }}
      >
        <div className="section-padding">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "72px",
              position: "relative",
            }}
          >

            {/* Left nav links */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "32px",
              }}
              className="hidden md:flex"
            >
              {links.slice(0, 3).map((l) => (
                <Link key={l.href} href={l.href} style={navLinkStyle(l.href)}>
                  {l.label}
                </Link>
              ))}
            </div>

            {/* Centre logo */}
            <Link
              href="/"
              style={{
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
                fontFamily: "Georgia, serif",
                fontSize: "22px",
                letterSpacing: "0.2em",
                color: "#0A0A0A",
                textTransform: "uppercase",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Rocksware
            </Link>

            {/* Right side */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "28px",
                marginLeft: "auto",
              }}
            >
              {/* Right nav links */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "28px",
                }}
                className="hidden md:flex"
              >
                {links.slice(3).map((l) => (
                  <Link key={l.href} href={l.href} style={navLinkStyle(l.href)}>
                    {l.label}
                  </Link>
                ))}
              </div>

              {/* Divider */}
              <div
                className="hidden md:block"
                style={{
                  width: "1px",
                  height: "16px",
                  backgroundColor: "#EDE8E0",
                }}
              />

              {/* Icons */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <button
                  className="hidden md:flex"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#2C2825",
                    padding: 0,
                    alignItems: "center",
                  }}
                >
                  <Search size={17} strokeWidth={1.5} />
                </button>

                <Link
                  href={user ? "/account" : "/auth/login"}
                  className="hidden md:flex"
                  style={{
                    color: "#2C2825",
                    textDecoration: "none",
                    alignItems: "center",
                  }}
                >
                  <User size={17} strokeWidth={1.5} />
                </Link>

                {/* Cart */}
                <Link
                  href="/cart"
                  style={{
                    position: "relative",
                    color: "#2C2825",
                    textDecoration: "none",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <ShoppingBag size={17} strokeWidth={1.5} />
                  {mounted && count > 0 && (
                    <span
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        backgroundColor: "#C4956A",
                        color: "white",
                        fontSize: "9px",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontFamily: "Jost, sans-serif",
                      }}
                    >
                      {count}
                    </span>
                  )}
                </Link>

                {/* Mobile menu toggle */}
                <button
                  className="md:hidden"
                  onClick={() => setMenuOpen(!menuOpen)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#2C2825",
                    padding: 0,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {menuOpen
                    ? <X size={20} strokeWidth={1.5} />
                    : <Menu size={20} strokeWidth={1.5} />
                  }
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div
            style={{
              backgroundColor: "#F5F0E8",
              borderTop: "1px solid #EDE8E0",
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setMenuOpen(false)}
                style={navLinkStyle(l.href)}
              >
                {l.label}
              </Link>
            ))}
            <div
              style={{
                borderTop: "1px solid #EDE8E0",
                paddingTop: "20px",
              }}
            >
              <Link
                href={user ? "/account" : "/auth/login"}
                onClick={() => setMenuOpen(false)}
                style={navLinkStyle("/auth/login")}
              >
                {user ? "My Account" : "Sign In"}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div style={{ height: "72px" }} />
    </>
  );
}
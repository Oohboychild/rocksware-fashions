"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { onAuthChange } from "@/lib/auth";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  LogOut,
  Plus,
} from "lucide-react";
import { logoutUser } from "@/lib/auth";
import toast from "react-hot-toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const unsub = onAuthChange((u) => {
      setUser(u);
      setLoading(false);
      if (!u || u.role !== "admin") {
        router.push("/auth/login");
      }
    });
    return () => unsub();
  }, []);

  const handleLogout = async () => {
    await logoutUser();
    setUser(null);
    toast.success("Logged out");
    router.push("/");
  };

  const navLinks = [
    { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Products", href: "/admin/products/new", icon: Package },
    { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen flex bg-[#F7F4F0]">

      {/* ── Sidebar ──────────────────────────────────────────────────── */}
      <aside className="w-64 bg-[#0A0A0A] flex flex-col fixed h-full z-40">

        {/* Logo */}
        <div className="p-8 border-b border-[#2C2825]">
          <Link
            href="/"
            className="font-display text-2xl tracking-[0.15em] text-[#F5F0E8] uppercase"
          >
            Rocksware
          </Link>
          <p className="text-[#C4956A] text-[10px] tracking-widest uppercase font-body mt-1">
            Admin Panel
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-6 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 text-xs tracking-widest uppercase font-body transition-colors ${
                  active
                    ? "bg-[#C4956A] text-white"
                    : "text-[#6E6860] hover:text-[#F5F0E8] hover:bg-[#2C2825]"
                }`}
              >
                <Icon size={15} />
                {link.label}
              </Link>
            );
          })}

          {/* Quick add */}
          <div className="pt-4 mt-4 border-t border-[#2C2825]">
            <Link
              href="/admin/products/new"
              className="flex items-center gap-3 px-4 py-3 text-xs tracking-widest uppercase font-body text-[#C4956A] hover:bg-[#2C2825] transition-colors"
            >
              <Plus size={15} />
              Add Product
            </Link>
          </div>
        </nav>

        {/* User + Logout */}
        <div className="p-6 border-t border-[#2C2825]">
          <p className="text-[#6E6860] text-xs font-body mb-1 truncate">
            {user?.email}
          </p>
          <p className="text-[#C4956A] text-[10px] tracking-widest uppercase font-body mb-4">
            Administrator
          </p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs tracking-widest uppercase font-body text-[#6E6860] hover:text-red-400 transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────────────────────────── */}
      <main className="ml-64 flex-1 min-h-screen">
        {children}
      </main>
    </div>
  );
}
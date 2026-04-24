"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { onAuthChange } from "@/lib/auth";
import { LayoutDashboard, Package, ShoppingBag, LogOut, Plus } from "lucide-react";
import { logoutUser } from "@/lib/auth";
import toast from "react-hot-toast";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: "#F7F4F0" }}>

      {/* Sidebar */}
      <aside style={{
        width: "256px",
        minWidth: "256px",
        backgroundColor: "#0A0A0A",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        zIndex: 40,
        overflowY: "auto",
      }}>

        {/* Logo */}
        <div style={{ padding: "32px", borderBottom: "1px solid #2C2825" }}>
          <Link href="/" style={{
            fontFamily: "Georgia, serif",
            fontSize: "24px",
            letterSpacing: "0.15em",
            color: "#F5F0E8",
            textTransform: "uppercase",
            textDecoration: "none",
          }}>
            Rocksware
          </Link>
          <p style={{
            color: "#C4956A",
            fontSize: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: "Jost, sans-serif",
            marginTop: "4px",
          }}>
            Admin Panel
          </p>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "24px", display: "flex", flexDirection: "column", gap: "4px" }}>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = pathname === link.href;
            return (
              <Link key={link.href} href={link.href} style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "12px 16px",
                fontSize: "11px",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                fontFamily: "Jost, sans-serif",
                textDecoration: "none",
                backgroundColor: active ? "#C4956A" : "transparent",
                color: active ? "white" : "#6E6860",
                transition: "all 0.2s",
              }}>
                <Icon size={15} />
                {link.label}
              </Link>
            );
          })}

          <div style={{ paddingTop: "16px", marginTop: "16px", borderTop: "1px solid #2C2825" }}>
            <Link href="/admin/products/new" style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              fontSize: "11px",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              fontFamily: "Jost, sans-serif",
              textDecoration: "none",
              color: "#C4956A",
            }}>
              <Plus size={15} />
              Add Product
            </Link>
          </div>
        </nav>

        {/* User + Logout */}
        <div style={{ padding: "24px", borderTop: "1px solid #2C2825" }}>
          <p style={{
            color: "#6E6860",
            fontSize: "12px",
            fontFamily: "Jost, sans-serif",
            marginBottom: "4px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}>
            {user?.email}
          </p>
          <p style={{
            color: "#C4956A",
            fontSize: "10px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: "Jost, sans-serif",
            marginBottom: "16px",
          }}>
            Administrator
          </p>
          <button onClick={handleLogout} style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            fontFamily: "Jost, sans-serif",
            color: "#6E6860",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}>
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{
        marginLeft: "256px",
        flex: 1,
        minHeight: "100vh",
        width: "calc(100% - 256px)",
        overflowX: "hidden",
      }}>
        {children}
      </main>

    </div>
  );
}
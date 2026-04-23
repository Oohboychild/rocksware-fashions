"use client";

import { useEffect, useState } from "react";
import { getShoes, getOrders } from "@/lib/firestore";
import { Shoe, Order } from "@/types";
import Link from "next/link";
import { Package, ShoppingBag, TrendingUp, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, o] = await Promise.all([getShoes(), getOrders()]);
        setShoes(s);
        setOrders(o);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalRevenue = orders
    .filter((o) => o.status === "paid" || o.status === "delivered")
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const lowStock = shoes.filter((s) => s.stock <= 5).length;

  const stats = [
    {
      label: "Total Products",
      value: shoes.length,
      icon: Package,
      color: "#C4956A",
      href: "/admin/products/new",
    },
    {
      label: "Total Orders",
      value: orders.length,
      icon: ShoppingBag,
      color: "#0A0A0A",
      href: "/admin/orders",
    },
    {
      label: "Revenue",
      value: `KES ${totalRevenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "#22C55E",
      href: "/admin/orders",
    },
    {
      label: "Low Stock",
      value: lowStock,
      icon: AlertCircle,
      color: "#EF4444",
      href: "/admin/products/new",
    },
  ];

  return (
    <div className="p-10">

      {/* Header */}
      <div className="mb-10">
        <p className="text-[#C4956A] text-xs tracking-[0.3em] uppercase font-body mb-2">
          Overview
        </p>
        <h1 className="font-display text-4xl text-[#0A0A0A]">Dashboard</h1>
      </div>

      {/* Stats */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {Array(4).fill(null).map((_, i) => (
            <div key={i} className="bg-white p-6 animate-pulse">
              <div className="bg-[#EDE8E0] h-4 w-20 mb-4" />
              <div className="bg-[#EDE8E0] h-8 w-16" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link key={stat.label} href={stat.href}>
                <div className="bg-white p-6 hover:shadow-md transition-shadow cursor-pointer group">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs tracking-widest uppercase font-body text-[#B5AFA6]">
                      {stat.label}
                    </p>
                    <Icon
                      size={18}
                      style={{ color: stat.color }}
                      className="opacity-60 group-hover:opacity-100 transition-opacity"
                    />
                  </div>
                  <p
                    className="font-display text-3xl"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Recent Orders */}
        <div className="bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-[#0A0A0A]">
              Recent Orders
            </h2>
            <Link
              href="/admin/orders"
              className="text-xs tracking-widest uppercase font-body text-[#C4956A] hover:underline"
            >
              View All
            </Link>
          </div>

          {orders.length === 0 ? (
            <p className="text-[#B5AFA6] font-body text-sm text-center py-8">
              No orders yet
            </p>
          ) : (
            <div className="space-y-3">
              {orders.slice(0, 5).map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between py-3 border-b border-[#F7F4F0]"
                >
                  <div>
                    <p className="font-body text-sm text-[#0A0A0A] font-medium">
                      {order.shippingAddress?.fullName || "Guest"}
                    </p>
                    <p className="font-body text-xs text-[#B5AFA6]">
                      {order.items.length} {order.items.length === 1 ? "item" : "items"} ·{" "}
                      {order.paymentMethod.toUpperCase()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-body text-sm text-[#0A0A0A]">
                      KES {order.total.toLocaleString()}
                    </p>
                    <span
                      className={`text-[10px] tracking-widest uppercase font-body px-2 py-0.5 ${
                        order.status === "paid" || order.status === "delivered"
                          ? "bg-green-50 text-green-600"
                          : order.status === "pending"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-[#F7F4F0] text-[#6E6860]"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product inventory */}
        <div className="bg-white p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl text-[#0A0A0A]">
              Inventory
            </h2>
            <Link
              href="/admin/products/new"
              className="text-xs tracking-widest uppercase font-body text-[#C4956A] hover:underline"
            >
              Add Product
            </Link>
          </div>

          {shoes.length === 0 ? (
            <p className="text-[#B5AFA6] font-body text-sm text-center py-8">
              No products yet
            </p>
          ) : (
            <div className="space-y-3">
              {shoes.slice(0, 5).map((shoe) => (
                <div
                  key={shoe.id}
                  className="flex items-center gap-4 py-3 border-b border-[#F7F4F0]"
                >
                  <div className="w-10 h-10 bg-[#EDE8E0] shrink-0 overflow-hidden">
                    {shoe.images?.[0] && (
                      <img
                        src={shoe.images[0]}
                        alt={shoe.name}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body text-sm text-[#0A0A0A] font-medium truncate">
                      {shoe.name}
                    </p>
                    <p className="font-body text-xs text-[#B5AFA6]">
                      {shoe.category} · KES {shoe.price.toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] tracking-widest uppercase font-body px-2 py-0.5 shrink-0 ${
                      shoe.stock === 0
                        ? "bg-red-50 text-red-500"
                        : shoe.stock <= 5
                        ? "bg-amber-50 text-amber-600"
                        : "bg-green-50 text-green-600"
                    }`}
                  >
                    {shoe.stock === 0 ? "Out" : `${shoe.stock} left`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pending alert */}
      {pendingOrders > 0 && (
        <div className="mt-8 bg-amber-50 border border-amber-200 p-4 flex items-center gap-4">
          <AlertCircle size={18} className="text-amber-500 shrink-0" />
          <p className="font-body text-sm text-amber-700">
            You have{" "}
            <strong>{pendingOrders}</strong>{" "}
            pending {pendingOrders === 1 ? "order" : "orders"} waiting for confirmation.{" "}
            <Link href="/admin/orders" className="underline underline-offset-2">
              View orders →
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}
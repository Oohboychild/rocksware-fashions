"use client";

import { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "@/lib/firestore";
import { Order } from "@/types";
import toast from "react-hot-toast";

const statusOptions: Order["status"][] = [
  "pending", "paid", "processing", "shipped", "delivered", "cancelled",
];

const statusColors: Record<Order["status"], string> = {
  pending: "bg-amber-50 text-amber-600",
  paid: "bg-blue-50 text-blue-600",
  processing: "bg-purple-50 text-purple-600",
  shipped: "bg-indigo-50 text-indigo-600",
  delivered: "bg-green-50 text-green-600",
  cancelled: "bg-red-50 text-red-500",
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Order["status"] | "all">("all");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (
    orderId: string,
    status: Order["status"]
  ) => {
    try {
      await updateOrderStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      toast.success("Order status updated");
    } catch (err) {
      toast.error("Failed to update status");
    }
  };

  const filtered =
    filter === "all" ? orders : orders.filter((o) => o.status === filter);

  return (
    <div className="p-10">

      <div className="mb-10">
        <p className="text-[#C4956A] text-xs tracking-[0.3em] uppercase font-body mb-2">
          Management
        </p>
        <h1 className="font-display text-4xl text-[#0A0A0A]">Orders</h1>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-8">
        {["all", ...statusOptions].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s as any)}
            className={`px-4 py-2 text-xs tracking-widest uppercase font-body border transition-colors ${
              filter === s
                ? "bg-[#0A0A0A] text-[#F5F0E8] border-[#0A0A0A]"
                : "bg-white text-[#6E6860] border-[#EDE8E0] hover:border-[#0A0A0A]"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array(5).fill(null).map((_, i) => (
            <div key={i} className="bg-white p-5 animate-pulse h-20" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white p-16 text-center">
          <p className="font-display text-2xl text-[#0A0A0A] mb-2">
            No orders found
          </p>
          <p className="text-[#B5AFA6] font-body text-sm">
            {filter === "all"
              ? "Orders will appear here once customers start buying."
              : `No ${filter} orders at the moment.`}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((order) => (
            <div key={order.id} className="bg-white p-5">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-body text-sm font-medium text-[#0A0A0A]">
                      {order.shippingAddress?.fullName || "Guest Customer"}
                    </p>
                    <span className={`text-[10px] tracking-widest uppercase font-body px-2 py-0.5 ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="font-body text-xs text-[#B5AFA6]">
                    {order.shippingAddress?.email} · {order.shippingAddress?.phone}
                  </p>
                  <p className="font-body text-xs text-[#B5AFA6] mt-1">
                    {order.items.length} {order.items.length === 1 ? "item" : "items"} ·{" "}
                    {order.paymentMethod.toUpperCase()} ·{" "}
                    <span className="text-[#0A0A0A] font-medium">
                      KES {order.total.toLocaleString()}
                    </span>
                  </p>
                </div>

                {/* Items preview */}
                <div className="flex gap-2">
                  {order.items.slice(0, 3).map((item, i) => (
                    <div key={i} className="w-10 h-10 bg-[#EDE8E0] overflow-hidden shrink-0">
                      {item.shoe?.images?.[0] && (
                        <img
                          src={item.shoe.images[0]}
                          alt={item.shoe.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>

                {/* Status updater */}
                <select
                  value={order.status}
                  onChange={(e) =>
                    handleStatusChange(order.id, e.target.value as Order["status"])
                  }
                  className="border border-[#EDE8E0] bg-white px-3 py-2 text-xs font-body text-[#0A0A0A] focus:outline-none focus:border-[#C4956A] transition-colors shrink-0"
                >
                  {statusOptions.map((s) => (
                    <option key={s} value={s}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ShippingAddress } from "@/types";
import toast from "react-hot-toast";
import { CreditCard, Smartphone, Check } from "lucide-react";
import Link from "next/link";

type PaymentMethod = "mpesa" | "airtel" | "visa";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const cartTotal = total();

  const [step, setStep] = useState<"details" | "payment" | "confirm">("details");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("mpesa");
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.displayName || "",
    phone: "",
    email: user?.email || "",
    address: "",
    city: "Nairobi",
    county: "Nairobi",
  });

  const [mpesaPhone, setMpesaPhone] = useState(address.phone);
  const [airtelPhone, setAirtelPhone] = useState(address.phone);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const deliveryFee = address.city.toLowerCase() === "nairobi" ? 200 : 500;
  const grandTotal = cartTotal + deliveryFee;

  if (items.length === 0 && !orderId) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center section-padding text-center">
        <h2 className="font-display text-4xl text-[#0A0A0A] mb-3">
          Nothing to checkout
        </h2>
        <p className="text-[#6E6860] font-body text-sm mb-8">
          Your cart is empty.
        </p>
        <Link href="/shop" className="btn-primary">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.email || !address.address) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep("payment");
    window.scrollTo(0, 0);
  };

  const createOrder = async (paymentRef: string) => {
    const orderData = {
      userId: user?.uid || null,
      guestEmail: !user ? address.email : null,
      items,
      total: grandTotal,
      status: "pending",
      paymentMethod,
      paymentRef,
      shippingAddress: address,
      createdAt: serverTimestamp(),
    };
    const ref = await addDoc(collection(db, "orders"), orderData);
    return ref.id;
  };

  const handleMpesa = async () => {
    if (!mpesaPhone) {
      toast.error("Please enter your M-Pesa number");
      return;
    }
    try {
      setLoading(true);
      const tempOrderId = `ORD-${Date.now()}`;
      const res = await fetch("/api/mpesa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: mpesaPhone,
          amount: grandTotal,
          orderId: tempOrderId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const id = await createOrder(data.checkoutRequestId || tempOrderId);
        setOrderId(id);
        clearCart();
        setStep("confirm");
        toast.success("M-Pesa prompt sent to your phone!");
      } else {
        toast.error(data.message || "M-Pesa payment failed");
      }
    } catch (err) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAirtel = async () => {
    if (!airtelPhone) {
      toast.error("Please enter your Airtel Money number");
      return;
    }
    try {
      setLoading(true);
      const tempOrderId = `ORD-${Date.now()}`;
      const res = await fetch("/api/airtel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: airtelPhone,
          amount: grandTotal,
          orderId: tempOrderId,
        }),
      });
      const data = await res.json();
      if (data.success) {
        const id = await createOrder(data.transactionId || tempOrderId);
        setOrderId(id);
        clearCart();
        setStep("confirm");
        toast.success("Airtel Money request sent!");
      } else {
        toast.error(data.message || "Airtel Money payment failed");
      }
    } catch (err) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVisa = async () => {
    if (!cardNumber || !cardExpiry || !cardCvv || !cardName) {
      toast.error("Please fill in all card details");
      return;
    }
    try {
      setLoading(true);
      // Stripe integration placeholder
      await new Promise((r) => setTimeout(r, 1500));
      const id = await createOrder(`VISA-${Date.now()}`);
      setOrderId(id);
      clearCart();
      setStep("confirm");
      toast.success("Payment successful!");
    } catch (err) {
      toast.error("Card payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-[#EDE8E0] bg-white px-4 py-3 text-sm font-body text-[#0A0A0A] placeholder:text-[#B5AFA6] focus:outline-none focus:border-[#C4956A] transition-colors";
  const labelClass =
    "block text-xs tracking-widest uppercase font-body text-[#6E6860] mb-2";

  // ── Confirm screen ──────────────────────────────────────────────────────
  if (step === "confirm") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center section-padding text-center py-20">
        <div className="w-16 h-16 bg-[#C4956A] rounded-full flex items-center justify-center mb-8">
          <Check size={28} className="text-white" />
        </div>
        <p className="text-[#C4956A] text-xs tracking-[0.3em] uppercase font-body mb-3">
          Thank You
        </p>
        <h1 className="font-display text-5xl text-[#0A0A0A] mb-4">
          Order Placed!
        </h1>
        <p className="text-[#6E6860] font-body text-sm leading-relaxed max-w-md mb-3">
          Your order has been received. We'll send a confirmation to{" "}
          <strong>{address.email}</strong>.
        </p>
        {paymentMethod === "mpesa" && (
          <p className="text-[#C4956A] font-body text-sm mb-8">
            Check your phone for the M-Pesa prompt and enter your PIN to complete payment.
          </p>
        )}
        {paymentMethod === "airtel" && (
          <p className="text-[#C4956A] font-body text-sm mb-8">
            Approve the Airtel Money request on your phone to complete payment.
          </p>
        )}
        {orderId && (
          <p className="text-[#B5AFA6] font-body text-xs mb-8">
            Order ID: <span className="text-[#0A0A0A] font-medium">{orderId}</span>
          </p>
        )}
        <div className="flex gap-4">
          <Link href="/shop" className="btn-primary">
            Continue Shopping
          </Link>
          {user && (
            <Link href="/account" className="btn-outline">
              My Orders
            </Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">

      {/* Header */}
      <div className="bg-[#0A0A0A] section-padding py-16">
        <div className="container-narrow">
          <p className="text-[#C4956A] text-xs tracking-[0.3em] uppercase font-body mb-3">
            Almost There
          </p>
          <h1 className="font-display text-5xl md:text-6xl text-[#F5F0E8]">
            Checkout
          </h1>

          {/* Progress */}
          <div className="flex items-center gap-3 mt-6">
            {["details", "payment"].map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-body font-medium transition-colors ${
                  step === s || (s === "details" && step === "payment")
                    ? "bg-[#C4956A] text-white"
                    : "bg-[#2C2825] text-[#6E6860]"
                }`}>
                  {s === "details" && step === "payment" ? <Check size={12} /> : i + 1}
                </div>
                <span className={`text-xs tracking-widest uppercase font-body ${
                  step === s ? "text-[#F5F0E8]" : "text-[#6E6860]"
                }`}>
                  {s}
                </span>
                {i === 0 && (
                  <div className={`w-12 h-px ${step === "payment" ? "bg-[#C4956A]" : "bg-[#2C2825]"}`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="section-padding py-12">
        <div className="container-narrow">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

            {/* ── Left — forms ─────────────────────────────────────────── */}
            <div className="lg:col-span-2">

              {/* Step 1 — Shipping details */}
              {step === "details" && (
                <form onSubmit={handleDetailsSubmit} className="space-y-6">
                  <div className="bg-white p-6">
                    <h2 className="font-display text-2xl text-[#0A0A0A] mb-6">
                      Shipping Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="md:col-span-2">
                        <label className={labelClass}>Full Name *</label>
                        <input
                          type="text"
                          value={address.fullName}
                          onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                          placeholder="Jane Doe"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Phone Number *</label>
                        <input
                          type="tel"
                          value={address.phone}
                          onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                          placeholder="0712 345 678"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Email *</label>
                        <input
                          type="email"
                          value={address.email}
                          onChange={(e) => setAddress({ ...address, email: e.target.value })}
                          placeholder="you@example.com"
                          className={inputClass}
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className={labelClass}>Street Address *</label>
                        <input
                          type="text"
                          value={address.address}
                          onChange={(e) => setAddress({ ...address, address: e.target.value })}
                          placeholder="e.g. 14 Kimathi Street, Apartment 3B"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>City *</label>
                        <input
                          type="text"
                          value={address.city}
                          onChange={(e) => setAddress({ ...address, city: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>County *</label>
                        <input
                          type="text"
                          value={address.county}
                          onChange={(e) => setAddress({ ...address, county: e.target.value })}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Guest note */}
                  {!user && (
                    <div className="bg-[#F7F4F0] border border-[#EDE8E0] p-4 flex items-start gap-3">
                      <p className="text-[#6E6860] font-body text-xs leading-relaxed">
                        Checking out as guest. {" "}
                        <Link href="/auth/register" className="text-[#C4956A] underline underline-offset-2">
                          Create an account
                        </Link>{" "}
                        to track your orders easily.
                      </p>
                    </div>
                  )}

                  <button type="submit" className="btn-cognac w-full py-4">
                    Continue to Payment
                  </button>
                </form>
              )}

              {/* Step 2 — Payment */}
              {step === "payment" && (
                <div className="space-y-6">
                  <div className="bg-white p-6">
                    <h2 className="font-display text-2xl text-[#0A0A0A] mb-6">
                      Payment Method
                    </h2>

                    {/* Method selector */}
                    <div className="grid grid-cols-3 gap-3 mb-8">
                      {[
                        { id: "mpesa", label: "M-Pesa", icon: Smartphone },
                        { id: "airtel", label: "Airtel Money", icon: Smartphone },
                        { id: "visa", label: "Visa Card", icon: CreditCard },
                      ].map((method) => {
                        const Icon = method.icon;
                        return (
                          <button
                            key={method.id}
                            onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                            className={`flex flex-col items-center gap-2 p-4 border-2 transition-colors ${
                              paymentMethod === method.id
                                ? "border-[#C4956A] bg-[#F5F0E8]"
                                : "border-[#EDE8E0] hover:border-[#B5AFA6]"
                            }`}
                          >
                            <Icon size={20} className={paymentMethod === method.id ? "text-[#C4956A]" : "text-[#B5AFA6]"} />
                            <span className="text-xs tracking-wide font-body text-[#2C2825]">
                              {method.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* M-Pesa form */}
                    {paymentMethod === "mpesa" && (
                      <div className="space-y-4">
                        <div className="bg-[#F0FDF4] border border-green-100 p-4">
                          <p className="text-green-700 font-body text-xs leading-relaxed">
                            You will receive an STK push notification on your phone. Enter your M-Pesa PIN to complete the payment.
                          </p>
                        </div>
                        <div>
                          <label className={labelClass}>M-Pesa Phone Number</label>
                          <input
                            type="tel"
                            value={mpesaPhone}
                            onChange={(e) => setMpesaPhone(e.target.value)}
                            placeholder="0712 345 678"
                            className={inputClass}
                          />
                        </div>
                        <button
                          onClick={handleMpesa}
                          disabled={loading}
                          className="w-full bg-[#1B8D3E] text-white py-4 text-sm tracking-widest uppercase font-body hover:bg-[#166D30] transition-colors disabled:opacity-50"
                        >
                          {loading ? "Sending M-Pesa Prompt..." : `Pay KES ${grandTotal.toLocaleString()} via M-Pesa`}
                        </button>
                      </div>
                    )}

                    {/* Airtel form */}
                    {paymentMethod === "airtel" && (
                      <div className="space-y-4">
                        <div className="bg-[#FFF7ED] border border-orange-100 p-4">
                          <p className="text-orange-700 font-body text-xs leading-relaxed">
                            You will receive an Airtel Money payment request. Approve it on your phone to complete the payment.
                          </p>
                        </div>
                        <div>
                          <label className={labelClass}>Airtel Money Number</label>
                          <input
                            type="tel"
                            value={airtelPhone}
                            onChange={(e) => setAirtelPhone(e.target.value)}
                            placeholder="0733 345 678"
                            className={inputClass}
                          />
                        </div>
                        <button
                          onClick={handleAirtel}
                          disabled={loading}
                          className="w-full bg-[#E4151B] text-white py-4 text-sm tracking-widest uppercase font-body hover:bg-[#C01217] transition-colors disabled:opacity-50"
                        >
                          {loading ? "Sending Request..." : `Pay KES ${grandTotal.toLocaleString()} via Airtel`}
                        </button>
                      </div>
                    )}

                    {/* Visa form */}
                    {paymentMethod === "visa" && (
                      <div className="space-y-4">
                        <div className="bg-[#EFF6FF] border border-blue-100 p-4">
                          <p className="text-blue-700 font-body text-xs leading-relaxed">
                            Your card details are encrypted and secure. We never store your card information.
                          </p>
                        </div>
                        <div>
                          <label className={labelClass}>Cardholder Name</label>
                          <input
                            type="text"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            placeholder="Jane Doe"
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label className={labelClass}>Card Number</label>
                          <input
                            type="text"
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim())}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className={inputClass}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className={labelClass}>Expiry Date</label>
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "");
                                setCardExpiry(val.length >= 2 ? `${val.slice(0, 2)}/${val.slice(2, 4)}` : val);
                              }}
                              placeholder="MM/YY"
                              maxLength={5}
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className={labelClass}>CVV</label>
                            <input
                              type="text"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                              placeholder="123"
                              maxLength={4}
                              className={inputClass}
                            />
                          </div>
                        </div>
                        <button
                          onClick={handleVisa}
                          disabled={loading}
                          className="w-full bg-[#1A1F71] text-white py-4 text-sm tracking-widest uppercase font-body hover:bg-[#14185A] transition-colors disabled:opacity-50"
                        >
                          {loading ? "Processing Payment..." : `Pay KES ${grandTotal.toLocaleString()} via Visa`}
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setStep("details")}
                    className="text-xs tracking-widest uppercase font-body text-[#6E6860] hover:text-[#0A0A0A] transition-colors"
                  >
                    ← Back to Details
                  </button>
                </div>
              )}
            </div>

            {/* ── Right — Order summary ─────────────────────────────────── */}
            <div className="lg:col-span-1">
              <div className="bg-[#F7F4F0] p-6 sticky top-24">
                <h2 className="font-display text-xl text-[#0A0A0A] mb-6">
                  Your Order
                </h2>

                {/* Items */}
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div
                      key={`${item.shoe.id}-${item.size}-${item.color}`}
                      className="flex gap-3"
                    >
                      <div className="w-14 h-14 bg-[#EDE8E0] shrink-0 overflow-hidden">
                        {item.shoe.images?.[0] && (
                          <img
                            src={item.shoe.images[0]}
                            alt={item.shoe.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-body text-xs font-medium text-[#0A0A0A] truncate">
                          {item.shoe.name}
                        </p>
                        <p className="font-body text-[10px] text-[#B5AFA6]">
                          Size {item.size} · {item.color} · Qty {item.quantity}
                        </p>
                        <p className="font-body text-xs text-[#0A0A0A] mt-0.5">
                          KES {(item.shoe.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-[#EDE8E0] pt-4 space-y-3">
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-[#6E6860]">Subtotal</span>
                    <span>KES {cartTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-[#6E6860]">Delivery</span>
                    <span>KES {deliveryFee.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between font-body font-medium border-t border-[#EDE8E0] pt-3">
                    <span>Total</span>
                    <span className="text-lg">KES {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Delivery note */}
                <p className="text-[10px] text-[#B5AFA6] font-body mt-4 leading-relaxed">
                  {address.city.toLowerCase() === "nairobi"
                    ? "Same-day delivery available in Nairobi (KES 200)"
                    : "Countrywide delivery (KES 500). 2–4 business days."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
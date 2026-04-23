"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerUser } from "@/lib/auth";
import { useAuthStore } from "@/store/authStore";
import toast from "react-hot-toast";
import { Eye, EyeOff, Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAuthStore((s) => s.setUser);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordStrength = () => {
    if (password.length === 0) return 0;
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strength = passwordStrength();
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];
  const strengthColor = ["", "#EF4444", "#F59E0B", "#84CC16", "#22C55E"][strength];

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!displayName || !email || !password || !confirm) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      setLoading(true);
      const user = await registerUser(email, password, displayName);
      setUser(user);
      toast.success(`Welcome to Rocksware, ${displayName}!`);
      router.push("/shop");
    } catch (err: any) {
      const msg =
        err.code === "auth/email-already-in-use"
          ? "This email is already registered"
          : err.code === "auth/weak-password"
          ? "Password is too weak"
          : "Something went wrong. Please try again";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">

      {/* Left — brand panel */}
      <div className="hidden md:flex flex-col justify-between bg-[#0A0A0A] p-16">
        <Link
          href="/"
          className="font-display text-3xl tracking-[0.15em] text-[#F5F0E8] uppercase"
        >
          Rocksware
        </Link>
        <div>
          <p className="text-[#C4956A] text-xs tracking-[0.3em] uppercase font-body mb-4">
            Join the Club
          </p>
          <h2 className="font-display text-5xl text-[#F5F0E8] leading-tight mb-6">
            Step into<br />
            <span className="italic text-[#C4956A]">something new</span>
          </h2>
          <div className="space-y-3">
            {[
              "Track your orders in real time",
              "Save your favourite styles",
              "Get early access to new arrivals",
              "Exclusive member offers",
            ].map((perk) => (
              <div key={perk} className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-[#C4956A] flex items-center justify-center shrink-0">
                  <Check size={10} className="text-white" />
                </div>
                <p className="text-[#B5AFA6] font-body font-light text-sm">{perk}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-[#2C2825] text-xs font-body">
          © {new Date().getFullYear()} Rocksware
        </p>
      </div>

      {/* Right — form */}
      <div className="flex flex-col justify-center px-8 md:px-16 lg:px-24 py-16 bg-[#F5F0E8]">

        {/* Mobile logo */}
        <Link
          href="/"
          className="md:hidden font-display text-2xl tracking-[0.15em] text-[#0A0A0A] uppercase mb-12"
        >
          Rocksware
        </Link>

        <div className="max-w-sm w-full mx-auto">
          <h1 className="font-display text-4xl text-[#0A0A0A] mb-2">
            Create Account
          </h1>
          <p className="text-[#6E6860] font-body text-sm mb-10">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-[#C4956A] hover:underline underline-offset-2"
            >
              Sign in
            </Link>
          </p>

          <form onSubmit={handleRegister} className="space-y-5">

            {/* Name */}
            <div>
              <label className="block text-xs tracking-widest uppercase font-body text-[#6E6860] mb-2">
                Full Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Jane Doe"
                className="w-full border border-[#EDE8E0] bg-white px-4 py-3 text-sm font-body text-[#0A0A0A] placeholder:text-[#B5AFA6] focus:outline-none focus:border-[#C4956A] transition-colors"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs tracking-widest uppercase font-body text-[#6E6860] mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full border border-[#EDE8E0] bg-white px-4 py-3 text-sm font-body text-[#0A0A0A] placeholder:text-[#B5AFA6] focus:outline-none focus:border-[#C4956A] transition-colors"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs tracking-widest uppercase font-body text-[#6E6860] mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-[#EDE8E0] bg-white px-4 py-3 text-sm font-body text-[#0A0A0A] placeholder:text-[#B5AFA6] focus:outline-none focus:border-[#C4956A] transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B5AFA6] hover:text-[#6E6860]"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Strength bar */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4].map((level) => (
                      <div
                        key={level}
                        className="h-1 flex-1 rounded-full transition-colors duration-300"
                        style={{
                          backgroundColor: strength >= level ? strengthColor : "#EDE8E0",
                        }}
                      />
                    ))}
                  </div>
                  <p className="text-[10px] font-body mt-1" style={{ color: strengthColor }}>
                    {strengthLabel}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs tracking-widest uppercase font-body text-[#6E6860] mb-2">
                Confirm Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className={`w-full border bg-white px-4 py-3 text-sm font-body text-[#0A0A0A] placeholder:text-[#B5AFA6] focus:outline-none transition-colors ${
                  confirm && confirm !== password
                    ? "border-red-300 focus:border-red-400"
                    : "border-[#EDE8E0] focus:border-[#C4956A]"
                }`}
              />
              {confirm && confirm !== password && (
                <p className="text-red-400 text-[10px] font-body mt-1">
                  Passwords do not match
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0A0A0A] text-[#F5F0E8] py-4 text-sm tracking-widest uppercase font-body hover:bg-[#C4956A] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>

            <p className="text-[10px] text-[#B5AFA6] font-body text-center leading-relaxed">
              By creating an account you agree to our{" "}
              <Link href="#" className="underline underline-offset-2 hover:text-[#6E6860]">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="#" className="underline underline-offset-2 hover:text-[#6E6860]">
                Privacy Policy
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addShoe } from "@/lib/firestore";
import { uploadMultipleImages } from "@/lib/cloudinary";
import { ShoeCategory } from "@/types";
import { Upload, X, Plus } from "lucide-react";
import toast from "react-hot-toast";

const categories: ShoeCategory[] = [
  "sneakers", "heels", "boots", "loafers", "sandals", "formal", "kids",
];

const commonSizes = [36, 37, 38, 39, 40, 41, 42, 43, 44, 45];

export default function AddProductPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [category, setCategory] = useState<ShoeCategory>("sneakers");
  const [featured, setFeatured] = useState(false);
  const [sizes, setSizes] = useState<number[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [colorInput, setColorInput] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length + images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }
    setImages((prev) => [...prev, ...files]);
    const newPreviews = files.map((f) => URL.createObjectURL(f));
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleSize = (size: number) => {
    setSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size].sort((a, b) => a - b)
    );
  };

  const addColor = () => {
    const c = colorInput.trim();
    if (!c) return;
    if (colors.includes(c)) {
      toast.error("Color already added");
      return;
    }
    setColors((prev) => [...prev, c]);
    setColorInput("");
  };

  const removeColor = (color: string) => {
    setColors((prev) => prev.filter((c) => c !== color));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !brand || !description || !price || !stock) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (sizes.length === 0) {
      toast.error("Please select at least one size");
      return;
    }
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    try {
      setUploading(true);
      toast.loading("Uploading images...");
      const imageUrls = await uploadMultipleImages(images);
      toast.dismiss();

      setLoading(true);
      toast.loading("Saving product...");

      await addShoe({
        name,
        brand,
        description,
        price: Number(price),
        stock: Number(stock),
        category,
        featured,
        sizes,
        colors,
        images: imageUrls,
      });

      toast.dismiss();
      toast.success("Product added successfully!");
      router.push("/admin/dashboard");
    } catch (err) {
      toast.dismiss();
      toast.error("Failed to add product. Please try again.");
      console.error(err);
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  const inputClass =
    "w-full border border-[#EDE8E0] bg-white px-4 py-3 text-sm font-body text-[#0A0A0A] placeholder:text-[#B5AFA6] focus:outline-none focus:border-[#C4956A] transition-colors";
  const labelClass =
    "block text-xs tracking-widest uppercase font-body text-[#6E6860] mb-2";

  return (
    <div className="p-10 max-w-4xl">

      <div className="mb-10">
        <p className="text-[#C4956A] text-xs tracking-[0.3em] uppercase font-body mb-2">
          Inventory
        </p>
        <h1 className="font-display text-4xl text-[#0A0A0A]">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ── Images ─────────────────────────────────────────────────── */}
        <div className="bg-white p-6">
          <h2 className="font-display text-xl text-[#0A0A0A] mb-6">
            Product Images
          </h2>

          <div className="flex gap-3 flex-wrap">
            {previews.map((src, i) => (
              <div key={i} className="relative w-24 h-24">
                <img
                  src={src}
                  alt={`Preview ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  <X size={10} />
                </button>
              </div>
            ))}

            {images.length < 5 && (
              <label className="w-24 h-24 border-2 border-dashed border-[#EDE8E0] flex flex-col items-center justify-center cursor-pointer hover:border-[#C4956A] transition-colors">
                <Upload size={18} className="text-[#B5AFA6] mb-1" />
                <span className="text-[10px] text-[#B5AFA6] font-body tracking-wide">
                  Add
                </span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImages}
                  className="hidden"
                />
              </label>
            )}
          </div>
          <p className="text-[10px] text-[#B5AFA6] font-body mt-3">
            Upload up to 5 images. First image will be the cover photo.
          </p>
        </div>

        {/* ── Basic Info ──────────────────────────────────────────────── */}
        <div className="bg-white p-6">
          <h2 className="font-display text-xl text-[#0A0A0A] mb-6">
            Product Details
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Product Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Air Phantom Pro"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Brand *</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. Nike"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Price (KES) *</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 8500"
                min="0"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Stock Quantity *</label>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="e.g. 20"
                min="0"
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ShoeCategory)}
                className={inputClass}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 pt-6">
              <input
                type="checkbox"
                id="featured"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="accent-[#C4956A] w-4 h-4"
              />
              <label
                htmlFor="featured"
                className="text-xs tracking-widest uppercase font-body text-[#6E6860] cursor-pointer"
              >
                Mark as Featured / New In
              </label>
            </div>

            <div className="md:col-span-2">
              <label className={labelClass}>Description *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the shoe — materials, style, occasion..."
                rows={4}
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </div>

        {/* ── Sizes ───────────────────────────────────────────────────── */}
        <div className="bg-white p-6">
          <h2 className="font-display text-xl text-[#0A0A0A] mb-2">Sizes</h2>
          <p className="text-[#B5AFA6] text-xs font-body mb-5">
            Select all available sizes for this product
          </p>
          <div className="flex gap-2 flex-wrap">
            {commonSizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`w-14 py-3 text-xs font-body border transition-colors ${
                  sizes.includes(size)
                    ? "bg-[#0A0A0A] text-[#F5F0E8] border-[#0A0A0A]"
                    : "bg-transparent text-[#6E6860] border-[#EDE8E0] hover:border-[#0A0A0A]"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* ── Colors ──────────────────────────────────────────────────── */}
        <div className="bg-white p-6">
          <h2 className="font-display text-xl text-[#0A0A0A] mb-2">Colors</h2>
          <p className="text-[#B5AFA6] text-xs font-body mb-5">
            Add available color options
          </p>

          <div className="flex gap-2 mb-4 flex-wrap">
            {colors.map((color) => (
              <span
                key={color}
                className="flex items-center gap-2 bg-[#F7F4F0] px-3 py-1.5 text-xs font-body text-[#2C2825]"
              >
                {color}
                <button
                  type="button"
                  onClick={() => removeColor(color)}
                  className="text-[#B5AFA6] hover:text-red-400"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-3">
            <input
              type="text"
              value={colorInput}
              onChange={(e) => setColorInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addColor())}
              placeholder="e.g. Midnight Black"
              className={`${inputClass} flex-1`}
            />
            <button
              type="button"
              onClick={addColor}
              className="bg-[#0A0A0A] text-white px-4 flex items-center gap-2 text-xs tracking-widest uppercase font-body hover:bg-[#C4956A] transition-colors"
            >
              <Plus size={14} />
              Add
            </button>
          </div>
        </div>

        {/* ── Submit ──────────────────────────────────────────────────── */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={uploading || loading}
            className="btn-cognac disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? "Uploading Images..." : loading ? "Saving..." : "Publish Product"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn-outline"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
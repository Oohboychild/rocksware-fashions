import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Shoe } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (shoe: Shoe, size: number, color: string) => void;
  removeItem: (shoeId: string, size: number, color: string) => void;
  updateQuantity: (shoeId: string, size: number, color: string, quantity: number) => void;
  clearCart: () => void;
  total: () => number;
  count: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (shoe, size, color) => {
        const items = get().items;
        const existing = items.find(
          (i) => i.shoe.id === shoe.id && i.size === size && i.color === color
        );
        if (existing) {
          set({
            items: items.map((i) =>
              i.shoe.id === shoe.id && i.size === size && i.color === color
                ? { ...i, quantity: i.quantity + 1 }
                : i
            ),
          });
        } else {
          set({ items: [...items, { shoe, size, color, quantity: 1 }] });
        }
      },

      removeItem: (shoeId, size, color) => {
        set({
          items: get().items.filter(
            (i) => !(i.shoe.id === shoeId && i.size === size && i.color === color)
          ),
        });
      },

      updateQuantity: (shoeId, size, color, quantity) => {
        set({
          items: get().items.map((i) =>
            i.shoe.id === shoeId && i.size === size && i.color === color
              ? { ...i, quantity }
              : i
          ),
        });
      },

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce((sum, i) => sum + i.shoe.price * i.quantity, 0),

      count: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "rocksware-cart" }
  )
);
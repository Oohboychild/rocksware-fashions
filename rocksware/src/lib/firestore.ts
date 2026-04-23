import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import { Shoe, Order } from "@/types";

// ── Shoes ────────────────────────────────────────────────────────────────────
export const addShoe = async (shoe: Omit<Shoe, "id" | "createdAt">) => {
  const ref = await addDoc(collection(db, "shoes"), {
    ...shoe,
    createdAt: serverTimestamp(),
  });
  return ref.id;
};

export const updateShoe = async (id: string, data: Partial<Shoe>) => {
  await updateDoc(doc(db, "shoes", id), data);
};

export const deleteShoe = async (id: string) => {
  await deleteDoc(doc(db, "shoes", id));
};

export const getShoes = async (): Promise<Shoe[]> => {
  const q = query(collection(db, "shoes"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Shoe[];
};

export const getShoe = async (id: string): Promise<Shoe | null> => {
  const snap = await getDoc(doc(db, "shoes", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Shoe;
};

// ── Orders ───────────────────────────────────────────────────────────────────
export const getOrders = async (): Promise<Order[]> => {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Order[];
};

export const updateOrderStatus = async (
  id: string,
  status: Order["status"]
) => {
  await updateDoc(doc(db, "orders", id), { status });
};
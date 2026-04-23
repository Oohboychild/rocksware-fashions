import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./firebase";
import { User } from "@/types";

export const registerUser = async (
  email: string,
  password: string,
  displayName: string
): Promise<User> => {
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(cred.user, { displayName });

  const user: User = {
    uid: cred.user.uid,
    email,
    displayName,
    role: "customer",
    createdAt: new Date(),
  };

  await setDoc(doc(db, "users", cred.user.uid), user);
  return user;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<User> => {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  const snap = await getDoc(doc(db, "users", cred.user.uid));

  if (!snap.exists()) throw new Error("User record not found");
  return snap.data() as User;
};

export const logoutUser = async () => {
  await signOut(auth);
};

export const onAuthChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
    if (!firebaseUser) {
      callback(null);
      return;
    }
    const snap = await getDoc(doc(db, "users", firebaseUser.uid));
    if (snap.exists()) {
      callback(snap.data() as User);
    } else {
      callback(null);
    }
  });
};
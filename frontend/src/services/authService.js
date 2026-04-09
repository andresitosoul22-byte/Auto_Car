import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";

async function buildPasswordFingerprint(email, password) {
  if (!password) return null;
  const source = `${email}:${password}`;
  const data = new TextEncoder().encode(source);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function loginOrRegisterWithEmail(email, password) {
  const passwordFingerprint = await buildPasswordFingerprint(email, password);
  try {
    const credentials = await signInWithEmailAndPassword(auth, email, password);
    return { credentials, passwordFingerprint };
  } catch {
    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    return { credentials, passwordFingerprint };
  }
}

export function loginWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export function logout() {
  return signOut(auth);
}

export function requestPasswordReset(email) {
  return sendPasswordResetEmail(auth, email);
}

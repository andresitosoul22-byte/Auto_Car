import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";

export async function upsertUserProfile(user, role, authMeta = {}) {
  const ref = doc(db, "users", user.uid);
  const normalizedRole =
    typeof role === "string" && role.toLowerCase() === "admin" ? "admin" : "cliente";
  await setDoc(
    ref,
    {
      uid: user.uid,
      email: user.email || "",
      name: user.displayName || "",
      role: normalizedRole,
      hasPassword: Boolean(authMeta.passwordFingerprint),
      passwordFingerprint: authMeta.passwordFingerprint || null,
      passwordUpdatedAt: authMeta.passwordFingerprint ? serverTimestamp() : null,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getUserProfile(uid) {
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function createVehicle(vehicle, ownerUid) {
  const ref = collection(db, "vehicles");
  await addDoc(ref, {
    ...vehicle,
    ownerUid,
    createdAt: serverTimestamp(),
  });
}

export async function listVehicles() {
  const q = query(collection(db, "vehicles"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createContract(contract, ownerUid) {
  const ref = collection(db, "contracts");
  await addDoc(ref, {
    ...contract,
    ownerUid,
    status: "pendiente",
    createdAt: serverTimestamp(),
  });
}

export async function listContractsByUser(ownerUid) {
  const q = query(
    collection(db, "contracts"),
    where("ownerUid", "==", ownerUid),
    orderBy("createdAt", "desc")
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

function timestampMs(value) {
  if (!value) return 0;
  if (typeof value.toMillis === "function") return value.toMillis();
  if (typeof value.seconds === "number") return value.seconds * 1000;
  return 0;
}

export async function listUsers() {
  const snap = await getDocs(collection(db, "users"));
  const rows = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  rows.sort((a, b) => timestampMs(b.updatedAt) - timestampMs(a.updatedAt));
  return rows;
}

export async function listContracts() {
  const q = query(collection(db, "contracts"), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function updateContractStatus(contractId, status, adminUid) {
  const ref = doc(db, "contracts", contractId);
  await updateDoc(ref, {
    status,
    reviewedBy: adminUid,
    reviewedAt: serverTimestamp(),
  });
}

export async function logPasswordRecovery(email) {
  await addDoc(collection(db, "password_recovery_requests"), {
    email,
    status: "sent",
    createdAt: serverTimestamp(),
  });
}

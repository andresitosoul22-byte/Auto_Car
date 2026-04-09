import { useCallback, useEffect, useMemo, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/config";
import { ADMIN_ACCESS_KEY } from "./utils/constants";
import {
  loginOrRegisterWithEmail,
  loginWithGoogle,
  logout,
  requestPasswordReset,
} from "./services/authService";
import {
  createContract,
  createVehicle,
  getUserProfile,
  listContracts,
  listContractsByUser,
  listUsers,
  listVehicles,
  logPasswordRecovery,
  updateContractStatus,
  upsertUserProfile,
} from "./services/firestoreService";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/AppLayout";
import LoginPage from "./pages/LoginPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import AdminPanel from "./components/AdminPanel";
import ClientePanel from "./components/ClientePanel";

function roleFromKey(adminKey) {
  return adminKey === ADMIN_ACCESS_KEY ? "admin" : "cliente";
}

function firestoreErrorMessage(err) {
  const code = err?.code;
  const msg = err?.message || "";
  if (code === "permission-denied" || msg.includes("permissions") || msg.includes("Permission")) {
    return "Permisos insuficientes en la base de datos. Desde la carpeta del proyecto ejecuta: firebase deploy --only firestore:rules (requiere Firebase CLI y haber iniciado sesion).";
  }
  return msg || "Error al cargar datos";
}

export default function App() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("cliente");
  const [loading, setLoading] = useState(true);
  const [dataError, setDataError] = useState("");
  const [vehicles, setVehicles] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [users, setUsers] = useState([]);

  const loadDashboardForUid = useCallback(async (uid) => {
    const profile = await getUserProfile(uid);
    const userRole = profile?.role || "cliente";
    setRole(userRole);

    if (userRole === "admin") {
      const [v, c, u] = await Promise.all([listVehicles(), listContracts(), listUsers()]);
      setVehicles(v);
      setContracts(c);
      setUsers(u);
    } else {
      const [v, c] = await Promise.all([listVehicles(), listContractsByUser(uid)]);
      setVehicles(v);
      setContracts(c);
      setUsers([]);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      setDataError("");

      if (!nextUser) {
        setVehicles([]);
        setContracts([]);
        setUsers([]);
        setRole("cliente");
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        await loadDashboardForUid(nextUser.uid);
      } catch (e) {
        console.error(e);
        setDataError(firestoreErrorMessage(e));
        setVehicles([]);
        setContracts([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    });
    return () => unsub();
  }, [loadDashboardForUid]);

  const defaultRoute = useMemo(() => (role === "admin" ? "/admin" : "/cliente"), [role]);

  const handleEmailLogin = async (email, password, adminKey) => {
    const { credentials, passwordFingerprint } = await loginOrRegisterWithEmail(email, password);
    const resolvedRole = roleFromKey(adminKey);
    await upsertUserProfile(credentials.user, resolvedRole, { passwordFingerprint });
    sessionStorage.removeItem("autocar_logout_lock");
    setLoading(true);
    setDataError("");
    try {
      await loadDashboardForUid(credentials.user.uid);
    } catch (e) {
      console.error(e);
      setDataError(firestoreErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (adminKey) => {
    if (adminKey?.trim()) {
      throw new Error("Para perfil administrador usa ingreso con correo y contrasena.");
    }
    const creds = await loginWithGoogle();
    const resolvedRole = roleFromKey(adminKey);
    await upsertUserProfile(creds.user, resolvedRole);
    sessionStorage.removeItem("autocar_logout_lock");
    setLoading(true);
    setDataError("");
    try {
      await loadDashboardForUid(creds.user.uid);
    } catch (e) {
      console.error(e);
      setDataError(firestoreErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const handleRecover = async (email) => {
    await requestPasswordReset(email);
    await logPasswordRecovery(email);
  };

  const handleLogout = async () => {
    sessionStorage.setItem("autocar_logout_lock", "1");
    setDataError("");
    await logout();
  };

  const handleCreateVehicle = async (vehicle) => {
    await createVehicle(vehicle, user.uid);
    const v = await listVehicles();
    setVehicles(v);
  };

  const handleCreateContract = async (contract) => {
    await createContract(contract, user.uid);
    const c = await listContractsByUser(user.uid);
    setContracts(c);
  };

  const handleUpdateContractStatus = async (contractId, status) => {
    await updateContractStatus(contractId, status, user.uid);
    const c = await listContracts();
    setContracts(c);
  };

  const retryLoadData = async () => {
    if (!user) return;
    setLoading(true);
    setDataError("");
    try {
      await loadDashboardForUid(user.uid);
    } catch (e) {
      console.error(e);
      setDataError(firestoreErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-slate-100 p-6">Cargando...</div>;
  }

  const dataErrorBanner =
    user && dataError ? (
      <div className="border-b border-amber-800/60 bg-amber-950/90 text-amber-100 px-4 py-3 text-sm">
        <p className="max-w-3xl mx-auto">{dataError}</p>
        <div className="max-w-3xl mx-auto mt-2">
          <button
            type="button"
            onClick={retryLoadData}
            className="rounded bg-amber-800 px-3 py-1 text-xs hover:bg-amber-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    ) : null;

  return (
    <BrowserRouter>
      {dataErrorBanner}
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to={defaultRoute} replace /> : <LoginPage onEmailLogin={handleEmailLogin} onGoogleLogin={handleGoogleLogin} />}
        />
        <Route
          path="/recuperar-contrasena"
          element={user ? <Navigate to={defaultRoute} replace /> : <ForgotPasswordPage onRecover={handleRecover} />}
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute user={user} role={role} allowedRole="admin">
              <AppLayout role={role} email={user?.email} onLogout={handleLogout}>
                <AdminPanel
                  vehicles={vehicles}
                  users={users}
                  contracts={contracts}
                  onCreateVehicle={handleCreateVehicle}
                  onUpdateContractStatus={handleUpdateContractStatus}
                />
              </AppLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/cliente"
          element={
            <ProtectedRoute user={user}>
              {role === "admin" ? (
                <Navigate to="/admin" replace />
              ) : (
                <AppLayout role={role} email={user?.email} onLogout={handleLogout}>
                  <ClientePanel
                    vehicles={vehicles}
                    contracts={contracts}
                    onCreateContract={handleCreateContract}
                  />
                </AppLayout>
              )}
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={user ? defaultRoute : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage({ onEmailLogin, onGoogleLogin }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminKey, setAdminKey] = useState("");
  const [error, setError] = useState("");
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("autocar_logout_lock") !== "1") {
      return undefined;
    }
    window.history.pushState(null, "", window.location.href);
    const onPopState = () => {
      navigate("/login", { replace: true });
      window.history.pushState(null, "", window.location.href);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [navigate]);

  const loginEmail = async (e) => {
    e.preventDefault();
    try {
      setError("");
      await onEmailLogin(email, password, adminKey);
    } catch (err) {
      setError(err.message || "No se pudo iniciar sesion");
    }
  };

  const loginGoogle = async () => {
    try {
      setError("");
      await onGoogleLogin(adminKey);
    } catch (err) {
      if (err?.code === "auth/popup-closed-by-user") {
        setError("Se cerro la ventana de Google. Intenta de nuevo para completar el acceso.");
        return;
      }
      setError(err.message || "No se pudo iniciar con Google");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 bg-[radial-gradient(circle_at_15%_20%,rgba(16,185,129,0.22),transparent_35%),radial-gradient(circle_at_85%_15%,rgba(59,130,246,0.2),transparent_40%)]">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/75 backdrop-blur p-6 shadow-2xl shadow-emerald-900/20">
        <h1 className="text-2xl font-semibold">Bienvenido a AutoCar</h1>
        <p className="text-sm text-slate-300 mt-1">Ingresa como cliente o administrador.</p>
        <form onSubmit={loginEmail} className="mt-5 space-y-3">
          <input className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2" placeholder="Correo electronico" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2" placeholder="Contrasena" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <input className="w-full rounded-lg bg-slate-950 border border-slate-700 px-3 py-2" placeholder="Llave admin (opcional)" type="password" value={adminKey} onChange={(e) => setAdminKey(e.target.value)} />
          <button className="w-full rounded-lg bg-emerald-600 hover:bg-emerald-500 py-2 font-medium transition-colors">Ingresar con correo</button>
        </form>
        <button
          className="w-full rounded-lg bg-slate-800 hover:bg-slate-700 py-2 mt-3 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={loginGoogle}
          disabled={Boolean(adminKey.trim())}
          title={adminKey.trim() ? "El acceso admin se realiza con correo y contrasena." : ""}
        >
          Ingresar con Google
        </button>
        <p className="text-sm mt-4">
          <Link
            to="/recuperar-contrasena"
            className={`transition-colors ${hovered ? "text-emerald-300 underline" : "text-slate-400"}`}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
          >
            ¿olvidaste tu contrasena?
          </Link>
        </p>
        <p className="text-xs text-slate-500 mt-3">
          Requisito admin: usa exactamente la llave <span className="text-emerald-300">AutoCarCheck2026</span>.
        </p>
        {error && <p className="text-sm text-red-300 mt-3">{error}</p>}
      </div>
    </div>
  );
}

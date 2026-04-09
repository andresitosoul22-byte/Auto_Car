import { Link, useNavigate } from "react-router-dom";

export default function AppLayout({ role, email, onLogout, children }) {
  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    await onLogout();
    navigate("/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 bg-[radial-gradient(circle_at_10%_20%,rgba(16,185,129,0.16),transparent_40%),radial-gradient(circle_at_90%_10%,rgba(59,130,246,0.14),transparent_35%)]">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-emerald-400">AutoCar</p>
            <h1 className="text-lg font-semibold">Panel {role === "admin" ? "Administrador" : "Cliente"}</h1>
            <p className="text-xs text-slate-400">{email}</p>
          </div>
          <div className="flex gap-2">
            <Link
              className="px-3 py-2 rounded bg-slate-800 text-sm hover:bg-slate-700 transition-colors"
              to={role === "admin" ? "/admin" : "/cliente"}
            >
              Inicio
            </Link>
            <button
              className="px-3 py-2 rounded bg-red-700 text-sm hover:bg-red-600 transition-colors"
              onClick={handleLogoutClick}
            >
              Cerrar sesion
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

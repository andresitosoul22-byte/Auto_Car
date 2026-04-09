import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPasswordPage({ onRecover }) {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      await onRecover(email);
      setMsg("cambios realizados con exito");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <h1 className="text-2xl font-semibold">Recuperar contrasena</h1>
        <p className="text-sm text-slate-400 mt-1">Ruta: /recuperar-contrasena</p>
        <form onSubmit={submit} className="mt-5 space-y-3">
          <input className="w-full rounded bg-slate-950 border border-slate-700 px-3 py-2" placeholder="Correo electronico" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button disabled={loading} className="w-full rounded bg-emerald-600 hover:bg-emerald-500 py-2">{loading ? "Procesando..." : "Solicitar recuperacion"}</button>
        </form>
        {msg && (
          <div className="mt-4 rounded border border-emerald-700/40 bg-emerald-950/40 p-3">
            <p className="text-emerald-300 text-sm">{msg}</p>
            <button onClick={() => navigate("/login")} className="mt-3 rounded bg-slate-800 px-3 py-2 text-sm">Continuar</button>
          </div>
        )}
      </div>
    </div>
  );
}

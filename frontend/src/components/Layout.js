export default function Layout({ role, onRoleChange, children }) {
  const tabClass = (active) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      active
        ? "bg-emerald-600 text-white shadow"
        : "bg-slate-800 text-slate-300 hover:bg-slate-700"
    }`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-400/90">AutoCar</p>
            <h1 className="text-xl font-semibold text-white">Alquiler de vehículos eléctricos e híbridos</h1>
          </div>
          <nav className="flex gap-2" aria-label="Vista de aplicación">
            <button type="button" className={tabClass(role === "cliente")} onClick={() => onRoleChange("cliente")}>
              Área cliente
            </button>
            <button type="button" className={tabClass(role === "admin")} onClick={() => onRoleChange("admin")}>
              Administración
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}

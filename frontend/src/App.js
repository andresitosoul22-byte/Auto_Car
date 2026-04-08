import { useEffect, useState } from "react";
import AdminPanel from "./components/AdminPanel";
import ClientePanel from "./components/ClientePanel";
import Layout from "./components/Layout";
import { loadContracts, loadVehicles, saveContracts, saveVehicles } from "./utils/storage";

export default function App() {
  const [role, setRole] = useState("cliente");
  const [vehicles, setVehicles] = useState([]);
  const [contracts, setContracts] = useState([]);

  useEffect(() => {
    setVehicles(loadVehicles());
    setContracts(loadContracts());
  }, []);

  const handleVehiclesChange = (next) => {
    setVehicles(next);
    saveVehicles(next);
  };

  const handleContractsChange = (next) => {
    setContracts(next);
    saveContracts(next);
  };

  return (
    <Layout role={role} onRoleChange={setRole}>
      {role === "admin" ? (
        <AdminPanel vehicles={vehicles} onVehiclesChange={handleVehiclesChange} />
      ) : (
        <ClientePanel vehicles={vehicles} contracts={contracts} onContractsChange={handleContractsChange} />
      )}
    </Layout>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";

export default function Home() {

  const router = useRouter();

  const [clienti, setClienti] = useState<any[]>([]);

  useEffect(() => {

    const auth = localStorage.getItem("auth");

    if (auth !== "true") {
      router.push("/login");
    }

    const dati = localStorage.getItem("clienti");

    if (dati) {
      setClienti(JSON.parse(dati));
    }

  }, []);

  const logout = () => {

    localStorage.removeItem("auth");

    router.push("/login");
  };

  const clientiPresenti = clienti.filter(
    (c) => c.pagato === true
  ).length;

  return (

    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* CONTENUTO */}
      <main className="flex-1 p-10 text-black">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-10">

          <div>

            <h1 className="text-6xl font-bold text-blue-600">
              Dashboard Gestionale
            </h1>

            <p className="text-gray-600 mt-4 text-xl">
              Accesso amministratore riservato
            </p>

          </div>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-4 rounded-2xl text-lg"
          >
            Logout
          </button>

        </div>

        {/* DASHBOARD */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 mt-10">

          {/* CLIENTI */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 min-h-[220px] flex flex-col justify-center">

            <h2 className="text-4xl font-bold text-blue-600">
              Clienti
            </h2>

            <p className="text-gray-500 mt-4 text-lg">
              Totale clienti registrati
            </p>

            <p className="text-5xl font-bold mt-6">
              {clienti.length}
            </p>

          </div>

          {/* ACCESSI */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 min-h-[220px] flex flex-col justify-center">

            <h2 className="text-4xl font-bold text-green-600">
              Accessi
            </h2>

            <p className="text-gray-500 mt-4 text-lg">
              Clienti attualmente attivi
            </p>

            <p className="text-5xl font-bold mt-6">
              {clientiPresenti}
            </p>

          </div>

          {/* CRM */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 min-h-[220px] flex flex-col justify-center">

            <h2 className="text-4xl font-bold text-purple-600">
              CRM
            </h2>

            <p className="text-gray-500 mt-4 text-lg">
              Gestione consulenze e appuntamenti
            </p>

          </div>

          {/* CALENDARIO */}
          <div className="bg-white rounded-3xl shadow-2xl p-10 min-h-[220px] flex flex-col justify-center">

            <h2 className="text-4xl font-bold text-red-600">
              Calendario
            </h2>

            <p className="text-gray-500 mt-4 text-lg">
              Organizzazione corsi e attività
            </p>

          </div>

        </div>

      </main>

    </div>
  );
}
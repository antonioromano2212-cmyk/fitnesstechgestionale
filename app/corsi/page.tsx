"use client";

import { useEffect, useState } from "react";

type Cliente = {
  id: number;
  nome: string;
  cognome: string;
  abbonamento?: string;
};

type Corso = {
  id: number;
  nome: string;
  max: number;
  iscritti: number[];
};

export default function CorsiPage() {
  const corsiBase: string[] = [
    "Pilates",
    "Yoga",
    "Stretching",
    "Jiu Jitsu",
    "Savate",
    "Jeet Kune Do",
    "Tai Chi",
    "Danza",
    "Cardio Dance",
    "Danza del Ventre",
    "Fitboxe",
    "Kettlebell",
    "GAG",
    "Tone Up",
    "Power Tone",
    "Body Sculpture",
    "Pump",
    "Ginnastica Aerobica",
    "Spinning",
    "Step Training",
    "Interval Training",
    "Aeroboxe",
    "NIA",
    "Total Body Conditioning",
    "Circuit Training",
    "Cross Training",
  ];

  const [corsi, setCorsi] = useState<Corso[]>([]);
  const [clienti, setClienti] = useState<Cliente[]>([]);
  const [nuovoCorso, setNuovoCorso] = useState<string>("");
  const [maxUtenti, setMaxUtenti] = useState<string>("");

  useEffect(() => {
    const savedClienti = localStorage.getItem("clienti");
    if (savedClienti) {
      try {
        setClienti(JSON.parse(savedClienti) as Cliente[]);
      } catch (error) {
        console.error("Errore parsing clienti:", error);
      }
    }

    const savedCorsi = localStorage.getItem("corsi");
    if (savedCorsi) {
      try {
        const parsed = JSON.parse(savedCorsi) as Corso[];
        const fix = parsed.map((c) => ({
          ...c,
          iscritti: Array.isArray(c.iscritti) ? c.iscritti : [],
        }));
        setCorsi(fix);
      } catch (error) {
        console.error("Errore parsing corsi:", error);
      }
    } else {
      const iniziali: Corso[] = corsiBase.map((nome, index) => ({
        id: index + 1,
        nome,
        max: 20,
        iscritti: [],
      }));
      setCorsi(iniziali);
    }
  }, []);

  useEffect(() => {
    if (corsi.length > 0) {
      localStorage.setItem("corsi", JSON.stringify(corsi));
    }
  }, [corsi]);

  const aggiungiCorso = () => {
    if (!nuovoCorso.trim() || !maxUtenti.trim()) return;

    const nuovo: Corso = {
      id: Date.now(),
      nome: nuovoCorso.trim(),
      max: Number(maxUtenti),
      iscritti: [],
    };

    setCorsi((prev) => [...prev, nuovo]);
    setNuovoCorso("");
    setMaxUtenti("");
  };

  const modificaCorso = <K extends keyof Corso>(
    id: number,
    campo: K,
    valore: Corso[K] | string
  ) => {
    setCorsi((prev) =>
      prev.map((corso) =>
        corso.id === id
          ? {
              ...corso,
              [campo]: campo === "max" ? Number(valore) : valore,
            }
          : corso
      )
    );
  };

  const eliminaCorso = (id: number) => {
    setCorsi((prev) => prev.filter((c) => c.id !== id));
  };

  const aggiungiCliente = (corsoId: number, clienteId: number) => {
    setCorsi((prev) =>
      prev.map((corso) => {
        if (corso.id !== corsoId) return corso;
        if (corso.iscritti.includes(clienteId)) return corso;
        if (corso.iscritti.length >= corso.max) {
          alert("Numero massimo raggiunto");
          return corso;
        }

        return {
          ...corso,
          iscritti: [...corso.iscritti, clienteId],
        };
      })
    );
  };

  const rimuoviCliente = (corsoId: number, clienteId: number) => {
    setCorsi((prev) =>
      prev.map((corso) =>
        corso.id === corsoId
          ? {
              ...corso,
              iscritti: corso.iscritti.filter((id) => id !== clienteId),
            }
          : corso
      )
    );
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-black">
      <h1 className="text-4xl font-bold text-blue-600 mb-8">Corsi Attivi</h1>

      <div className="bg-white p-6 rounded-2xl shadow mb-8">
        <h2 className="text-2xl font-bold mb-4">Nuovo Corso</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            value={nuovoCorso}
            onChange={(e) => setNuovoCorso(e.target.value)}
            placeholder="Nome Corso"
            className="border p-3 rounded-xl"
          />

          <input
            type="number"
            value={maxUtenti}
            onChange={(e) => setMaxUtenti(e.target.value)}
            placeholder="Numero massimo utenti"
            className="border p-3 rounded-xl"
          />
        </div>

        <button
          onClick={aggiungiCorso}
          className="mt-4 bg-green-600 text-white px-6 py-3 rounded-xl"
        >
          Aggiungi Corso
        </button>
      </div>

      <div className="grid gap-6">
        {corsi.map((corso) => (
          <div key={corso.id} className="bg-white rounded-2xl shadow p-6">
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <input
                value={corso.nome}
                onChange={(e) => modificaCorso(corso.id, "nome", e.target.value)}
                className="border p-3 rounded-xl font-bold"
              />

              <input
                type="number"
                value={corso.max}
                onChange={(e) => modificaCorso(corso.id, "max", e.target.value)}
                className="border p-3 rounded-xl"
              />

              <button
                onClick={() => eliminaCorso(corso.id)}
                className="bg-red-600 text-white rounded-xl px-4 py-3"
              >
                Elimina Corso
              </button>
            </div>

            <p className="mb-3 text-lg">
              <strong>Posti Occupati:</strong> {corso.iscritti.length} / {corso.max}
            </p>

            <select
              onChange={(e) => {
                if (e.target.value) {
                  aggiungiCliente(corso.id, Number(e.target.value));
                  e.target.value = "";
                }
              }}
              className="border p-3 rounded-xl w-full mb-5"
              defaultValue=""
            >
              <option value="">Unisci Cliente al Corso</option>
              {clienti.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  #{cliente.id} - {cliente.nome} {cliente.cognome}
                </option>
              ))}
            </select>

            <div className="grid gap-3">
              {corso.iscritti.map((idCliente) => {
                const cliente = clienti.find((c) => c.id === idCliente);
                if (!cliente) return null;

                return (
                  <div
                    key={idCliente}
                    className="border rounded-xl p-4 flex justify-between items-center bg-gray-50"
                  >
                    <div>
                      <p className="font-bold">
                        {cliente.nome} {cliente.cognome}
                      </p>
                      <p className="text-sm text-gray-600">
                        ID Cliente: {cliente.id}
                      </p>
                      <p className="text-sm text-gray-600">
                        Abbonamento: {cliente.abbonamento || "Non specificato"}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <a
                        href={`/clienti?id=${cliente.id}`}
                        className="bg-blue-600 text-white px-4 py-2 rounded-xl"
                      >
                        Scheda Cliente
                      </a>

                      <button
                        onClick={() => rimuoviCliente(corso.id, idCliente)}
                        className="bg-red-500 text-white px-4 py-2 rounded-xl"
                      >
                        Rimuovi
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
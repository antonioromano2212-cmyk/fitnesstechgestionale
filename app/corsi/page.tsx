"use client";

import { useEffect, useState } from "react";

export default function CorsiPage() {

  const corsiBase = [
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
    "Cross Training"
  ];

  const [corsi, setCorsi] = useState([]);
  const [clienti, setClienti] = useState([]);

  const [nuovoCorso, setNuovoCorso] = useState("");
  const [maxUtenti, setMaxUtenti] = useState("");

  // LOAD
  useEffect(() => {

    const savedClienti = localStorage.getItem("clienti");

    if (savedClienti) {
      setClienti(JSON.parse(savedClienti));
    }

    const savedCorsi = localStorage.getItem("corsi");

    if (savedCorsi) {

      const parsed = JSON.parse(savedCorsi);

      const fix = parsed.map((c) => ({
        ...c,
        iscritti: c.iscritti || [],
      }));

      setCorsi(fix);

    } else {

      const iniziali = corsiBase.map((nome, index) => ({
        id: index + 1,
        nome,
        max: 20,
        iscritti: [],
      }));

      setCorsi(iniziali);
    }

  }, []);

  // SAVE
  useEffect(() => {
    localStorage.setItem("corsi", JSON.stringify(corsi));
  }, [corsi]);

  // AGGIUNGI CORSO
  const aggiungiCorso = () => {

    if (!nuovoCorso || !maxUtenti) return;

    const nuovo = {
      id: Date.now(),
      nome: nuovoCorso,
      max: Number(maxUtenti),
      iscritti: [],
    };

    setCorsi([...corsi, nuovo]);

    setNuovoCorso("");
    setMaxUtenti("");
  };

  // MODIFICA CORSO
  const modificaCorso = (id, campo, valore) => {

    setCorsi(
      corsi.map((corso) =>
        corso.id === id
          ? {
              ...corso,
              [campo]: campo === "max" ? Number(valore) : valore,
            }
          : corso
      )
    );
  };

  // ELIMINA CORSO
  const eliminaCorso = (id) => {
    setCorsi(corsi.filter((c) => c.id !== id));
  };

  // ISCRIZIONE CLIENTE
  const aggiungiCliente = (corsoId, clienteId) => {

    setCorsi(
      corsi.map((corso) => {

        if (corso.id !== corsoId) return corso;

        if ((corso.iscritti || []).includes(clienteId)) return corso;

        if ((corso.iscritti || []).length >= corso.max) {
          alert("Numero massimo raggiunto");
          return corso;
        }

        return {
          ...corso,
          iscritti: [...(corso.iscritti || []), clienteId],
        };

      })
    );
  };

  // RIMUOVI CLIENTE
  const rimuoviCliente = (corsoId, clienteId) => {

    setCorsi(
      corsi.map((corso) =>
        corso.id === corsoId
          ? {
              ...corso,
              iscritti: (corso.iscritti || []).filter(
                (id) => id !== clienteId
              ),
            }
          : corso
      )
    );
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8 text-black">

      <h1 className="text-4xl font-bold text-blue-600 mb-8">
        Corsi Attivi
      </h1>

      {/* AGGIUNGI NUOVO CORSO */}
      <div className="bg-white p-6 rounded-2xl shadow mb-8">

        <h2 className="text-2xl font-bold mb-4">
          Nuovo Corso
        </h2>

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

      {/* LISTA CORSI */}
      <div className="grid gap-6">

        {corsi.map((corso) => (

          <div
            key={corso.id}
            className="bg-white rounded-2xl shadow p-6"
          >

            {/* HEADER */}
            <div className="grid md:grid-cols-3 gap-4 mb-4">

              <input
                value={corso.nome || ""}
                onChange={(e) =>
                  modificaCorso(corso.id, "nome", e.target.value)
                }
                className="border p-3 rounded-xl font-bold"
              />

              <input
                type="number"
                value={corso.max || ""}
                onChange={(e) =>
                  modificaCorso(corso.id, "max", e.target.value)
                }
                className="border p-3 rounded-xl"
              />

              <button
                onClick={() => eliminaCorso(corso.id)}
                className="bg-red-600 text-white rounded-xl"
              >
                Elimina Corso
              </button>

            </div>

            <p className="mb-3 text-lg">
              <strong>Posti Occupati:</strong>{" "}
              {(corso.iscritti || []).length} / {corso.max}
            </p>

            {/* SELECT CLIENTI */}
            <select
              onChange={(e) => {
                if (e.target.value) {
                  aggiungiCliente(corso.id, Number(e.target.value));
                }
              }}
              className="border p-3 rounded-xl w-full mb-5"
            >
              <option value="">
                Unisci Cliente al Corso
              </option>

              {clienti.map((cliente) => (

                <option
                  key={cliente.id}
                  value={cliente.id}
                >
                  #{cliente.id} - {cliente.nome} {cliente.cognome}
                </option>

              ))}

            </select>

            {/* CLIENTI ISCRITTI */}
            <div className="grid gap-3">

              {(corso.iscritti || []).map((idCliente) => {

                const cliente = clienti.find(
                  (c) => c.id === idCliente
                );

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
                        Abbonamento: {cliente.abbonamento}
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
                        onClick={() =>
                          rimuoviCliente(corso.id, idCliente)
                        }
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
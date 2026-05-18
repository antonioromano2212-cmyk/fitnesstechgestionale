"use client";

import { useEffect, useState } from "react";

export default function ClientiPage() {

  const [clienti, setClienti] = useState<any[]>([]);

  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [abbonamento, setAbbonamento] = useState("");
  const [scadenza, setScadenza] = useState("");

  const [residente, setResidente] = useState("");
  const [indirizzo, setIndirizzo] = useState("");
  const [citta, setCitta] = useState("");
  const [dataNascita, setDataNascita] = useState("");
  const [cellulare, setCellulare] = useState("");

  const [certificato, setCertificato] = useState<File | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);

  // LOAD CLIENTI
  useEffect(() => {

    const dati = localStorage.getItem("clienti");

    if (!dati) return;

    try {

      const parsed = JSON.parse(dati);

      setClienti(parsed);

    } catch {

      setClienti([]);
    }

  }, []);

  // SAVE CLIENTI
  useEffect(() => {

    localStorage.setItem(
      "clienti",
      JSON.stringify(clienti)
    );

  }, [clienti]);

  // RESET FORM
  const resetForm = () => {

    setNome("");
    setCognome("");
    setAbbonamento("");
    setScadenza("");

    setResidente("");
    setIndirizzo("");
    setCitta("");
    setDataNascita("");
    setCellulare("");

    setCertificato(null);

    setEditingId(null);
  };

  // AGGIUNGI CLIENTE
  const aggiungiCliente = () => {

    if (!nome || !cognome || !abbonamento) return;

    // MODIFICA
    if (editingId) {

      setClienti(

        clienti.map((c) =>

          c.id === editingId
            ? {
                ...c,
                nome,
                cognome,
                abbonamento,
                scadenza,
                residente,
                indirizzo,
                citta,
                dataNascita,
                cellulare,
                certificato:
                  certificato
                    ? certificato.name
                    : c.certificato,
              }
            : c
        )
      );

      resetForm();

      return;
    }

    // NUOVO CLIENTE
    const nuovoCliente = {

      id: Date.now(),

      nome,
      cognome,
      abbonamento,
      scadenza,

      residente,
      indirizzo,
      citta,
      dataNascita,
      cellulare,

      certificato:
        certificato
          ? certificato.name
          : "",

      pagato: false,
    };

    setClienti([
      ...clienti,
      nuovoCliente,
    ]);

    resetForm();
  };

  // PAGAMENTO
  const togglePagato = (id: number) => {

    setClienti(

      clienti.map((c) =>

        c.id === id
          ? {
              ...c,
              pagato: !c.pagato,
            }
          : c
      )
    );
  };

  // MODIFICA
  const startEdit = (cliente: any) => {

    setEditingId(cliente.id);

    setNome(cliente.nome || "");
    setCognome(cliente.cognome || "");
    setAbbonamento(cliente.abbonamento || "");
    setScadenza(cliente.scadenza || "");

    setResidente(cliente.residente || "");
    setIndirizzo(cliente.indirizzo || "");
    setCitta(cliente.citta || "");
    setDataNascita(cliente.dataNascita || "");
    setCellulare(cliente.cellulare || "");
  };

  return (

    <main className="min-h-screen bg-gray-100 p-10 text-black">

      {/* TITOLO */}
      <h1 className="text-5xl font-bold text-blue-600 mb-10">
        Gestione Clienti
      </h1>

      {/* FORM */}
      <div className="bg-white p-8 rounded-3xl shadow-2xl mb-10">

        <div className="grid md:grid-cols-2 gap-5">

          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
            className="border p-4 rounded-xl"
          />

          <input
            value={cognome}
            onChange={(e) => setCognome(e.target.value)}
            placeholder="Cognome"
            className="border p-4 rounded-xl"
          />

          <input
            value={abbonamento}
            onChange={(e) => setAbbonamento(e.target.value)}
            placeholder="Abbonamento"
            className="border p-4 rounded-xl"
          />

          <input
            type="date"
            value={scadenza}
            onChange={(e) => setScadenza(e.target.value)}
            className="border p-4 rounded-xl"
          />

          <input
            value={residente}
            onChange={(e) => setResidente(e.target.value)}
            placeholder="Residente"
            className="border p-4 rounded-xl"
          />

          <input
            value={indirizzo}
            onChange={(e) => setIndirizzo(e.target.value)}
            placeholder="Indirizzo"
            className="border p-4 rounded-xl"
          />

          <input
            value={citta}
            onChange={(e) => setCitta(e.target.value)}
            placeholder="Città"
            className="border p-4 rounded-xl"
          />

          <input
            type="date"
            value={dataNascita}
            onChange={(e) => setDataNascita(e.target.value)}
            className="border p-4 rounded-xl"
          />

          <input
            value={cellulare}
            onChange={(e) => setCellulare(e.target.value)}
            placeholder="Cellulare"
            className="border p-4 rounded-xl"
          />

          <input
            type="file"
            onChange={(e) =>
              setCertificato(
                e.target.files?.[0] || null
              )
            }
            className="border p-4 rounded-xl"
          />

        </div>

        <button
          onClick={aggiungiCliente}
          className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl text-lg"
        >
          {editingId
            ? "Salva Modifica"
            : "Aggiungi Cliente"}
        </button>

      </div>

      {/* LISTA CLIENTI */}
      <div className="grid gap-6">

        {clienti.map((cliente) => (

          <div
            key={cliente.id}
            className={`bg-white rounded-3xl shadow-xl p-8 border-l-8 ${
              cliente.pagato
                ? "border-green-500"
                : "border-red-500"
            }`}
          >

            <div className="grid md:grid-cols-2 gap-4 text-lg">

              <p>
                <strong>Nome:</strong> {cliente.nome}
              </p>

              <p>
                <strong>Cognome:</strong> {cliente.cognome}
              </p>

              <p>
                <strong>Abbonamento:</strong> {cliente.abbonamento}
              </p>

              <p>
                <strong>Scadenza:</strong> {cliente.scadenza}
              </p>

              <p>
                <strong>Residente:</strong> {cliente.residente}
              </p>

              <p>
                <strong>Indirizzo:</strong> {cliente.indirizzo}
              </p>

              <p>
                <strong>Città:</strong> {cliente.citta}
              </p>

              <p>
                <strong>Data Nascita:</strong> {cliente.dataNascita}
              </p>

              <p>
                <strong>Cellulare:</strong> {cliente.cellulare}
              </p>

              <p>
                <strong>Certificato:</strong>{" "}
                {cliente.certificato || "Nessuno"}
              </p>

              <p>
                <strong>Pagamento:</strong>{" "}
                {cliente.pagato
                  ? "CONFERMATO"
                  : "NON PAGATO"}
              </p>

            </div>

            {/* BOTTONI */}
            <div className="flex gap-4 mt-8">

              <button
                onClick={() =>
                  togglePagato(cliente.id)
                }
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl"
              >
                Conferma Pagamento
              </button>

              <button
                onClick={() =>
                  startEdit(cliente)
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
              >
                Modifica
              </button>

              <button
                onClick={() =>
                  setClienti(
                    clienti.filter(
                      (c) => c.id !== cliente.id
                    )
                  )
                }
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl"
              >
                Elimina
              </button>

            </div>

          </div>

        ))}

      </div>

    </main>
  );
}
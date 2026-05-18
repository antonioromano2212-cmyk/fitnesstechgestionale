"use client";

import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import * as XLSX from "xlsx";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";

type Lead = {
  firebaseId?: string;
  nome: string;
  cognome: string;
  telefono: string;
  email: string;
  consulente: string;
  data: string;
  ora: string;
  note: string;
  stato: string;
};

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [consulente, setConsulente] = useState("");
  const [data, setData] = useState("");
  const [ora, setOra] = useState("");
  const [note, setNote] = useState("");
  const [stato, setStato] = useState("NUOVO");

  const [ricerca, setRicerca] = useState("");
  const [filtroStato, setFiltroStato] = useState("TUTTI");
  const [errore, setErrore] = useState("");

  const caricaLead = async () => {
    try {
      const snapshot = await getDocs(collection(db, "leads"));
      const listaLead: Lead[] = snapshot.docs.map((docItem) => {
        const d = docItem.data() as Partial<Lead>;
        return {
          firebaseId: docItem.id,
          nome: d.nome || "",
          cognome: d.cognome || "",
          telefono: d.telefono || "",
          email: d.email || "",
          consulente: d.consulente || "",
          data: d.data || "",
          ora: d.ora || "",
          note: d.note || "",
          stato: d.stato || "NUOVO",
        };
      });

      setLeads(listaLead);
      setErrore("");
    } catch (err) {
      console.error("ERRORE LETTURA leads da Firestore:", err);
      setLeads([]);
      setErrore("Firestore non disponibile o database (default) mancante.");
    }
  };

  useEffect(() => {
    caricaLead();
  }, []);

  const resetForm = () => {
    setNome("");
    setCognome("");
    setTelefono("");
    setEmail("");
    setConsulente("");
    setData("");
    setOra("");
    setNote("");
    setStato("NUOVO");
  };

  const openNewLeadForm = () => {
    setIsEditing(false);
    setEditingId(null);
    resetForm();
    setShowForm(true);
  };

  const openEditLead = (lead: Lead) => {
    setIsEditing(true);
    setEditingId(lead.firebaseId || null);
    setNome(lead.nome);
    setCognome(lead.cognome);
    setTelefono(lead.telefono);
    setEmail(lead.email);
    setConsulente(lead.consulente);
    setData(lead.data);
    setOra(lead.ora);
    setNote(lead.note);
    setStato(lead.stato || "NUOVO");
    setShowForm(true);
  };

  const saveLead = async () => {
    if (!nome || !telefono) {
      alert("Inserisci nome e telefono");
      return;
    }

    const leadData = {
      nome,
      cognome,
      telefono,
      email,
      consulente,
      data,
      ora,
      note,
      stato,
    };

    try {
      if (isEditing && editingId) {
        await updateDoc(doc(db, "leads", editingId), leadData);
      } else {
        await addDoc(collection(db, "leads"), leadData);
      }

      if (data && ora) {
        const start = new Date(`${data}T${ora}`);
        const end = new Date(start.getTime() + 60 * 60 * 1000);

        const formatDate = (date: Date) =>
          date.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

        const googleUrl =
          `https://calendar.google.com/calendar/render?action=TEMPLATE` +
          `&text=Appuntamento+${encodeURIComponent(nome)}+${encodeURIComponent(cognome)}` +
          `&dates=${formatDate(start)}/${formatDate(end)}` +
          `&details=Telefono:+${encodeURIComponent(telefono)}`;

        window.open(googleUrl, "_blank");
      }

      resetForm();
      setShowForm(false);
      setIsEditing(false);
      setEditingId(null);
      await caricaLead();
    } catch (err) {
      console.error("ERRORE SALVATAGGIO LEAD in Firestore:", err);
      alert("Errore salvataggio lead. Controlla Firestore e la configurazione del progetto.");
    }
  };

  const eliminaLead = async (firebaseId?: string) => {
    if (!firebaseId) return;
    try {
      await deleteDoc(doc(db, "leads", firebaseId));
      await caricaLead();
    } catch (err) {
      console.error("ERRORE ELIMINAZIONE lead da Firestore:", err);
      alert("Errore eliminazione lead.");
    }
  };

  const exportExcel = () => {
    const dati = leads.map((lead) => ({
      Nome: lead.nome,
      Cognome: lead.cognome,
      Telefono: lead.telefono,
      Email: lead.email,
      Consulente: lead.consulente,
      Data: lead.data,
      Ora: lead.ora,
      Stato: lead.stato,
      Note: lead.note,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dati);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Lead CRM");
    XLSX.writeFile(workbook, "crm-palestra.xlsx");
  };

  const importExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json<any>(worksheet);

      for (const item of jsonData) {
        await addDoc(collection(db, "leads"), {
          nome: item.Nome || "",
          cognome: item.Cognome || "",
          telefono: item.Telefono || "",
          email: item.Email || "",
          consulente: item.Consulente || "",
          data: item.Data || "",
          ora: item.Ora || "",
          stato: item.Stato || "NUOVO",
          note: item.Note || "",
        });
      }

      await caricaLead();
      alert("Import completato!");
    } catch (err) {
      console.error("ERRORE IMPORT Excel:", err);
      alert("Errore import Excel.");
    }
  };

  const getColor = (dataLead: string) => {
    if (!dataLead) return "bg-white";
    const oggi = new Date();
    const dataRiga = new Date(dataLead);
    oggi.setHours(0, 0, 0, 0);
    dataRiga.setHours(0, 0, 0, 0);

    if (dataRiga < oggi) return "bg-red-200";
    if (dataRiga.getTime() === oggi.getTime()) return "bg-yellow-200";
    return "bg-green-200";
  };

  const leadsFiltrati = leads.filter((lead) => {
    const testo = `${lead.nome} ${lead.cognome} ${lead.telefono} ${lead.email} ${lead.consulente} ${lead.stato}`.toLowerCase();
    return testo.includes(ricerca.toLowerCase()) && (filtroStato === "TUTTI" || lead.stato === filtroStato);
  });

  const datiGrafico = [
    { name: "Nuovi", value: leads.filter((l) => l.stato === "NUOVO").length },
    { name: "Contattati", value: leads.filter((l) => l.stato === "CONTATTATO").length },
    { name: "Iscritti", value: leads.filter((l) => l.stato === "ISCRITTO").length },
    { name: "Persi", value: leads.filter((l) => l.stato === "PERSO").length },
  ];

  const COLORS = ["#3B82F6", "#EAB308", "#22C55E", "#EF4444"];

  return (
    <main className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6 gap-3 flex-wrap">
        <h1 className="text-4xl font-bold text-black">CRM PALESTRA</h1>

        <div className="flex gap-3 flex-wrap">
          <button type="button" onClick={openNewLeadForm} className="bg-cyan-500 text-white px-6 py-3 rounded-xl">
            + Nuovo Lead
          </button>

          <button type="button" onClick={exportExcel} className="bg-green-600 text-white px-6 py-3 rounded-xl">
            Export Excel
          </button>

          <label className="bg-blue-500 text-white px-6 py-3 rounded-xl cursor-pointer">
            Import Excel
            <input type="file" accept=".xlsx, .xls" onChange={importExcel} className="hidden" />
          </label>
        </div>
      </div>

      {errore && <div className="bg-red-100 text-red-700 p-4 rounded-xl mb-6">{errore}</div>}

      <div className="bg-white rounded-2xl shadow p-4 mb-6">
        <input
          value={ricerca}
          onChange={(e) => setRicerca(e.target.value)}
          placeholder="Cerca lead..."
          className="border p-3 rounded-xl text-black w-full"
        />
        <select
          value={filtroStato}
          onChange={(e) => setFiltroStato(e.target.value)}
          className="border p-3 rounded-xl text-black w-full mt-3 bg-white"
        >
          <option value="TUTTI">TUTTI</option>
          <option value="NUOVO">NUOVO</option>
          <option value="CONTATTATO">CONTATTATO</option>
          <option value="ISCRITTO">ISCRITTO</option>
          <option value="PERSO">PERSO</option>
        </select>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow p-6 mb-8">
          <h2 className="text-2xl mb-4 text-black">{isEditing ? "Modifica Lead" : "Nuovo Lead"}</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome" className="border p-3 rounded-xl text-black" />
            <input type="text" value={cognome} onChange={(e) => setCognome(e.target.value)} placeholder="Cognome" className="border p-3 rounded-xl text-black" />
            <input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} placeholder="Telefono" className="border p-3 rounded-xl text-black" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="border p-3 rounded-xl text-black" />
            <input type="text" value={consulente} onChange={(e) => setConsulente(e.target.value)} placeholder="Consulente" className="border p-3 rounded-xl text-black" />
            <input type="date" value={data} onChange={(e) => setData(e.target.value)} className="border p-3 rounded-xl text-black" />
            <input type="time" value={ora} onChange={(e) => setOra(e.target.value)} className="border p-3 rounded-xl text-black" />
            <select
              value={stato}
              onChange={(e) => setStato(e.target.value)}
              className="border p-3 rounded-xl text-black bg-white w-full h-14 text-lg font-bold"
            >
              <option value="NUOVO">NUOVO</option>
              <option value="CONTATTATO">CONTATTATO</option>
              <option value="ISCRITTO">ISCRITTO</option>
              <option value="PERSO">PERSO</option>
            </select>
          </div>

          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note"
            className="border p-3 rounded-xl w-full h-32 mt-4 text-black"
          />

          <div className="flex gap-3 mt-5">
            <button onClick={saveLead} className="bg-green-600 text-white px-6 py-3 rounded-xl">
              {isEditing ? "Aggiorna Lead" : "Salva Lead"}
            </button>

            <button
              onClick={() => {
                setShowForm(false);
                setIsEditing(false);
                setEditingId(null);
              }}
              className="bg-gray-500 text-white px-6 py-3 rounded-xl"
            >
              Annulla
            </button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-600 text-white rounded-2xl p-6 shadow">
          <h2 className="text-lg font-bold">Totale Lead</h2>
          <p className="text-4xl font-bold mt-2">{leads.length}</p>
        </div>
        <div className="bg-green-600 text-white rounded-2xl p-6 shadow">
          <h2 className="text-lg font-bold">Iscritti</h2>
          <p className="text-4xl font-bold mt-2">{leads.filter((l) => l.stato === "ISCRITTO").length}</p>
        </div>
        <div className="bg-red-600 text-white rounded-2xl p-6 shadow">
          <h2 className="text-lg font-bold">Persi</h2>
          <p className="text-4xl font-bold mt-2">{leads.filter((l) => l.stato === "PERSO").length}</p>
        </div>
        <div className="bg-yellow-500 text-white rounded-2xl p-6 shadow">
          <h2 className="text-lg font-bold">Contattati</h2>
          <p className="text-4xl font-bold mt-2">{leads.filter((l) => l.stato === "CONTATTATO").length}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-2xl font-bold text-black mb-4">Calendario Appuntamenti</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {leads
            .filter((lead) => lead.data)
            .sort((a, b) => {
              const dataA = new Date(`${a.data}T${a.ora || "00:00"}`).getTime();
              const dataB = new Date(`${b.data}T${b.ora || "00:00"}`).getTime();
              return dataA - dataB;
            })
            .map((lead) => (
              <div
                key={lead.firebaseId}
                className={`${getColor(lead.data)} border rounded-2xl p-4 text-black shadow`}
              >
                <h3 className="text-xl font-bold">
                  {lead.nome} {lead.cognome}
                </h3>
                <p><strong>Data:</strong> {lead.data}</p>
                <p><strong>Ora:</strong> {lead.ora}</p>
                <p><strong>Telefono:</strong> {lead.telefono}</p>
                <p><strong>Consulente:</strong> {lead.consulente}</p>
                <p><strong>Stato:</strong> {lead.stato}</p>
              </div>
            ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow p-6 mb-6">
        <h2 className="text-2xl font-bold text-black mb-4">Lead per Stato</h2>
        <div className="w-full h-80 min-h-[320px]">
          <ResponsiveContainer width="100%" height="100%" minWidth={0} minHeight={320}>
            <BarChart data={datiGrafico} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                {datiGrafico.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="overflow-auto bg-white rounded-2xl shadow p-6">
        <table className="w-full border">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 border">Cliente</th>
              <th className="p-3 border">Data</th>
              <th className="p-3 border">Ora</th>
              <th className="p-3 border">Telefono</th>
              <th className="p-3 border">Consulente</th>
              <th className="p-3 border">Stato</th>
              <th className="p-3 border">Note</th>
              <th className="p-3 border">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {leadsFiltrati.map((lead) => (
              <tr key={lead.firebaseId} className={`${getColor(lead.data)} text-black`}>
                <td className="p-3 border">{lead.nome} {lead.cognome}</td>
                <td className="p-3 border">{lead.data}</td>
                <td className="p-3 border">{lead.ora}</td>
                <td className="p-3 border">{lead.telefono}</td>
                <td className="p-3 border">{lead.consulente}</td>
                <td className="p-3 border">{lead.stato}</td>
                <td className="p-3 border">{lead.note}</td>
                <td className="p-3 border">
                  <div className="flex gap-2 flex-wrap">
                    <button onClick={() => openEditLead(lead)} className="bg-blue-600 text-white px-4 py-2 rounded-xl">
                      Modifica
                    </button>
                    <button onClick={() => eliminaLead(lead.firebaseId)} className="bg-red-600 text-white px-4 py-2 rounded-xl">
                      Elimina
                    </button>
                    <a
                      href={`https://wa.me/${lead.telefono}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-500 text-white px-4 py-2 rounded-xl"
                    >
                      WhatsApp
                    </a>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
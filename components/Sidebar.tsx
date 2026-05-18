"use client";

import Link from "next/link";

export default function Sidebar() {

  return (

    <div className="w-64 bg-gray-900 text-white min-h-screen p-5">

      <h1 className="text-3xl font-bold mb-10 text-center">
        Gestionale
      </h1>

      <div className="flex flex-col gap-4">

        <Link
          href="/"
          className="bg-gray-800 hover:bg-gray-700 p-3 rounded-xl"
        >
          Dashboard
        </Link>

        <Link
          href="/clienti"
          className="bg-gray-800 hover:bg-gray-700 p-3 rounded-xl"
        >
          Clienti
        </Link>

        <Link
          href="/corsi"
          className="bg-gray-800 hover:bg-gray-700 p-3 rounded-xl"
        >
          Corsi
        </Link>

        <Link
          href="/crm"
          className="bg-gray-800 hover:bg-gray-700 p-3 rounded-xl"
        >
          CRM
        </Link>

        <Link
          href="/calendario"
          className="bg-gray-800 hover:bg-gray-700 p-3 rounded-xl"
        >
          Calendario
        </Link>

      </div>

    </div>
  );
}
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = () => {

    if (username === "admin" && password === "1234") {

      localStorage.setItem("auth", "true");

      router.push("/");

    } else {

      alert("Password o username errati");
    }
  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="bg-white p-10 rounded-3xl shadow-xl w-[350px]">

        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Login Gestionale
        </h1>

        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border p-3 rounded-xl mb-4 text-black"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-3 rounded-xl mb-6 text-black"
        />

        <button
          onClick={login}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl"
        >
          Entra
        </button>

      </div>

    </div>
  );
}
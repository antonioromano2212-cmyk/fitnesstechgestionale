import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Questo permette la build statica per Workers
};

module.exports = nextConfig;
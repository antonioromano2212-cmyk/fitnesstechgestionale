import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAbBFl7q7ezx9J7NAHCQOcvvy3yfprJ_5c",
  authDomain: "crm-palestra99.firebaseapp.com",
  projectId: "crm-palestra99",
  storageBucket: "crm-palestra99.firebasestorage.app",
  messagingSenderId: "491605441771",
  appId: "1:491605441771:web:0227dbe829fe69e6f592ae",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, "crm-gestionale");
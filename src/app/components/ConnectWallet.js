"use client";
import { useState } from "react";
import { ethers } from "ethers";

export default function ConnectWallet({ setSigner, setAccount }) {
  const [connected, setConnected] = useState(false);

  async function connect() {
    if (!window.ethereum) return alert("Please install MetaMask!");
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });

      setSigner(signer);
      setAccount(accounts[0]);
      setConnected(true);
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <button
      onClick={connect}
      className={`px-6 py-3 rounded-xl font-semibold transition 
        ${connected ? "bg-green-500 text-white" : "bg-blue-600 text-white hover:bg-blue-700"}`}
    >
      {connected ? "✅ Wallet Connected" : "🔗 Connect Wallet"}
    </button>
  );
}

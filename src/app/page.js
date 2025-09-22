"use client";
import { useState } from "react";
import ConnectWallet from "./components/ConnectWallet";
import RegisterWork from "./components/RegisterWork";
import WorksList from "./components/WorksList";

export default function Home() {
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);

  return (
    <main className="min-h-screen bg-gray-100 p-10 text-black">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center ">
          📜 Copyright Management DApp
        </h1>
        <div className="flex justify-center mb-6">
          <ConnectWallet setSigner={setSigner} setAccount={setAccount} />
        </div>

        {signer && (
          <>
            <RegisterWork signer={signer} />
            <WorksList signer={signer} account={account} />
          </>
        )}
      </div>
    </main>
  );
}

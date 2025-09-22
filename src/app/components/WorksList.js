"use client";
import { useState } from "react";
import { getContract } from "../../utils/contract";

export default function WorksList({ signer, account }) {
  const [works, setWorks] = useState([]);

  async function loadWorks() {
    if (!signer) return;
    const contract = getContract(signer);

    const workIds = await contract.getWorksByOwner(account);
    const details = await Promise.all(
      workIds.map(async (id) => {
        const [title, contents, ipfsHash, owner, timestamp, active] =
          await contract.getWorkDetails(id);
        return {
          id: id.toString(),
          title,
          contents,
          ipfsHash,
          owner,
          timestamp: new Date(Number(timestamp) * 1000).toLocaleString(),
          active,
        };
      })
    );
    setWorks(details);
  }

  return (
    <div className="mt-8">
      <button
        onClick={loadWorks}
        className="px-5 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
      >
        📂 Load My Works
      </button>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {works.map((w) => (
          <div key={w.id} className="p-4 bg-white shadow rounded-lg">
            <h3 className="font-bold text-lg">{w.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{w.contents}</p>
            <a
              href={`https://gateway.pinata.cloud/ipfs/${w.ipfsHash}`}
              target="_blank"
              className="text-blue-500 underline mt-2 block"
            >
              View File ↗
            </a>
            <p className="text-xs text-gray-500 mt-1">Owner: {w.owner}</p>
            <p className="text-xs text-gray-500">Registered: {w.timestamp}</p>
            <p className="text-xs font-medium mt-1">
              Status: {w.active ? "✅ Active" : "❌ Retired"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

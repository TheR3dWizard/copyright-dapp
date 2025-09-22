"use client";
import { useState } from "react";
import { uploadToPinata } from "../../utils/pinata";
import { getContract } from "../../utils/contract";
import { ethers } from "ethers";

export default function RegisterWork({ signer }) {
  const [title, setTitle] = useState("");
  const [contents, setContents] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleFileChange(e) {
    const selected = e.target.files[0];
    setFile(selected);
    if (selected) {
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result);
      reader.readAsDataURL(selected);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!signer || !file) return alert("Connect wallet & select file!");

    try {
      setLoading(true);
      const ipfsHash = await uploadToPinata(file);

      const contract = getContract(signer);
      const workId = Date.now();
      const tx = await contract.registerWork(workId, title, contents, ipfsHash);
      await tx.wait();

      alert("✅ Work registered successfully!");
      setTitle("");
      setContents("");
      setFile(null);
      setPreview(null);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 p-6 bg-white shadow-lg rounded-xl flex flex-col gap-4 max-w-lg"
    >
      <h2 className="text-xl font-semibold">📤 Register New Work</h2>

      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
      />

      <textarea
        placeholder="Contents / Description"
        value={contents}
        onChange={(e) => setContents(e.target.value)}
        className="p-3 border rounded-md focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="file"
        onChange={handleFileChange}
        className="file:mr-4 file:py-2 file:px-4 file:rounded-full 
                   file:border-0 file:text-sm file:font-semibold
                   file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
      />

      {preview && (
        <div className="border rounded-lg p-3 bg-gray-50">
          <p className="text-sm font-medium mb-2">📑 File Preview:</p>
          {file.type.startsWith("image/") && (
            <img src={preview} alt="preview" className="rounded-md max-h-48 object-contain" />
          )}
          {file.type.startsWith("text/") && (
            <pre className="text-xs whitespace-pre-wrap max-h-48 overflow-y-auto">{preview}</pre>
          )}
          {file.type === "application/pdf" && (
            <embed src={preview} type="application/pdf" width="100%" height="200px" />
          )}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className={`px-5 py-3 rounded-lg text-white font-semibold 
          ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"}`}
      >
        {loading ? "⏳ Uploading..." : "Register Work"}
      </button>
    </form>
  );
}

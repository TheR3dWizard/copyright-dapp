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
        const network = await provider.getNetwork();

        // Sepolia chainId is 11155111
        if (network.chainId !== 11155111n) {
            try {
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0xaa36a7" }], // 0xaa36a7 is 11155111 in hex
            });
            // After switching, reload to update provider/signer
            window.location.reload();
            } catch (switchError) {
            // This error code indicates the chain has not been added to MetaMask
            if (switchError.code === 4902) {
                try {
                await window.ethereum.request({
                    method: "wallet_addEthereumChain",
                    params: [{
                    chainId: "0xaa36a7",
                    chainName: "Sepolia Testnet",
                    nativeCurrency: {
                        name: "SepoliaETH",
                        symbol: "ETH",
                        decimals: 18,
                    },
                    rpcUrls: ["https://rpc.sepolia.org"],
                    blockExplorerUrls: ["https://sepolia.etherscan.io"],
                    }],
                });
                window.location.reload();
                } catch (addError) {
                alert("Failed to add Sepolia network.");
                }
            } else {
                alert("Please switch to the Sepolia testnet in MetaMask.");
            }
            }
            return;
        }

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

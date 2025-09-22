import { ethers } from "ethers";
import contractABI from "../abi/CopyrightManagement.json";

export function getContract(signerOrProvider) {
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    contractABI,
    signerOrProvider
  );
}

import { useState } from "react";
import { ethers } from "ethers";
import marketplaceAbi from "./MarketplaceABI.json";

const CONTRACT_ADDRESS = "0x9a7dFc6E01968E83Af6C47fC6ebf88e1327f2dC2"; // thay bằng địa chỉ contract NFT bạn đã deploy

function MintNFT({ signer }) {
  const [loading, setLoading] = useState(false);

  async function handleMint() {
    if (!signer) {
      alert("Connect wallet first!");
      return;
    }

    try {
      setLoading(true);

      const contract = new ethers.Contract(CONTRACT_ADDRESS, marketplaceAbi, signer);

      const tx = await contract.mint({
        value: ethers.parseEther("0.01"), // Gửi đúng 0.01 MON
      });

      await tx.wait();

      alert("Mint successful!");
    } catch (error) {
      console.error("Mint failed:", error);
      alert("Mint failed!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Mint NFT</h2>
      <button className="primary-button" onClick={handleMint} disabled={loading}>
        {loading ? "Minting..." : "Mint NFT"}
      </button>
    </div>
  );
}

export default MintNFT;

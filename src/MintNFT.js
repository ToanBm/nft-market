import { ethers, BrowserProvider, Contract } from "ethers";
import { nfts } from "./nfts";
import { useState } from "react";

function MintNFT() {
  const [minting, setMinting] = useState(false);

  async function handleMint(nft) {
    if (!window.ethereum) {
      alert("Please install MetaMask or OKX Wallet!");
      return;
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(nft.contract, nft.abi, signer);

    try {
      setMinting(true);
      const tx = await contract.mint({ value: ethers.parseEther("0.01") });
      await tx.wait();
      alert(`Minted ${nft.name} successfully!`);
    } catch (error) {
      console.error("Mint failed:", error);
      alert("Mint failed!");
    } finally {
      setMinting(false);
    }
  }

  return (
    <div>
      <h2 className="section-title">NFT Mint</h2>
      <div className="nft-grid">
        {nfts.map((nft) => (
          <div key={nft.name} className="nft-card">
            {/* ✅ Hiển thị icon mạng nếu có */}
            {nft.networkIcon && (
              <img
                src={nft.networkIcon}
                alt="network"
                className="network-icon"
              />
            )}

            <img src={nft.image} alt={nft.name} className="nft-image" />
            <div className="nft-name">{nft.name}</div>

            {nft.contract.startsWith("0x") && nft.contract.length === 42 ? (
              <button
                onClick={() => handleMint(nft)}
                className="mint-button"
                disabled={minting}
              >
                {minting ? "Minting..." : "Mint"}
              </button>
            ) : (
              <button className="mint-button-disabled" disabled>
                Coming Soon
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MintNFT;

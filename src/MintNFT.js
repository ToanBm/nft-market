// src/MintNFT.js
import { ethers, BrowserProvider, Contract } from "ethers";
import { nfts } from "./nfts"; // file data NFT (bạn cần tạo)

function MintNFT() {
  async function handleMint(nft) {
    if (!window.ethereum) {
      alert("Please install MetaMask or OKX Wallet!");
      return;
    }

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new Contract(nft.contract, nft.abi, signer);

    try {
      const tx = await contract.mint({ value: ethers.parseEther("0.01") });
      await tx.wait();
      alert(`Minted ${nft.name} successfully!`);
    } catch (error) {
      console.error("Mint failed:", error);
      alert("Mint failed!");
    }
  }

  return (
    <div className="mint-grid">
      {nfts.map((nft) => (
        <div key={nft.name} className="mint-card">
          <img src={nft.image} alt={nft.name} className="mint-image" />
          <button onClick={() => handleMint(nft)} className="mint-button">
            Mint
          </button>
        </div>
      ))}
    </div>
  );
}

export default MintNFT;

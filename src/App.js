import { useState, useEffect } from "react";
import {
  connectWallet,
  getExistingWallet,
  disconnectWallet,
  switchNetwork
} from "./connectWallet";
import { CHAINS } from "./chains";
import MintNFT from "./MintNFT";
import ListNFT from "./ListNFT";
import { Contract } from "ethers";
import { MarketplaceAbi } from "./MarketplaceAbi";
import "./App.css";

function App() {
  const [signer, setSigner] = useState(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [selectedChain, setSelectedChain] = useState("MONAD");
  const [userNFTs, setUserNFTs] = useState([]);

  // ✅ Auto-reconnect silently after reload
  useEffect(() => {
    async function reconnect() {
      const wallet = await getExistingWallet();
      if (wallet?.signer) {
        const address = await wallet.signer.getAddress();
        setSigner(wallet.signer);
        setWalletAddress(address);
      }
    }

    reconnect();

    window.ethereum?.on("accountsChanged", (accounts) => {
      if (accounts.length === 0) {
        disconnect();
      } else {
        connect();
      }
    });
  }, []);

  // 🔌 Connect wallet
  async function connect() {
    const wallet = await connectWallet();
    if (wallet) {
      const address = await wallet.signer.getAddress();
      setSigner(wallet.signer);
      setWalletAddress(address);
    }
  }

  // ❌ Disconnect wallet
  function disconnect() {
    disconnectWallet();
    setSigner(null);
    setWalletAddress("");
    setUserNFTs([]);
  }

  // 🌐 Switch or disconnect network
  async function handleSwitchNetwork(chainKey) {
    if (chainKey === "DISCONNECT") {
      disconnect();
      return;
    }
    const chainInfo = CHAINS[chainKey];
    await switchNetwork(chainInfo);
    setSelectedChain(chainKey);
  }

  // 📦 Load user's NFTs
  async function loadUserNFTs() {
    if (!signer) return;
    try {
      const contract = new Contract(
        CHAINS[selectedChain].contractAddress,
        MarketplaceAbi,
        signer
      );
      const address = await signer.getAddress();
      const balance = await contract.balanceOf(address);
      const nfts = [];

      for (let i = 0; i < balance; i++) {
        const tokenId = await contract.tokenOfOwnerByIndex(address, i);
        const tokenUri = await contract.tokenURI(tokenId);
        const metadata = await fetch(tokenUri).then((res) => res.json());

        nfts.push({
          id: tokenId.toString(),
          name: metadata.name || `NFT #${tokenId}`,
          image: metadata.image || "",
        });
      }

      setUserNFTs(nfts);
    } catch (error) {
      console.error("Failed to load NFTs:", error);
      setUserNFTs([]);
    }
  }

  useEffect(() => {
    loadUserNFTs();
  }, [signer]);

  return (
    <div className="container">
      {/* Left: Mint and List */}
      <div className="left-panel">
        <MintNFT signer={signer} />
        <ListNFT signer={signer} />
      </div>

      {/* Center: Placeholder */}
      <div className="center-panel">
        <div className="coming-soon">Coming Soon</div>
      </div>

      {/* Right: 3 vertical sections */}
      <div className="right-panel">
        {/* Top 20%: Wallet + Network + Faucet */}
        <div className="network-panel">
          <div className="network-row">
            {!signer ? (
              <button className="wallet-button" onClick={connect}>
                Connect Wallet
              </button>
            ) : (
              <div className="wallet-button" style={{ backgroundColor: "#444", color: "#fff", cursor: "default" }}>
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
            )}

            <select
              className="network-selector"
              value={selectedChain}
              onChange={(e) => handleSwitchNetwork(e.target.value)}
            >
              <option value="MONAD">Monad Testnet</option>
              <option value="SOMNIA">Somnia Testnet</option>
              {signer && <option value="DISCONNECT">Disconnect Wallet</option>}
            </select>
          </div>

          <button className="faucet-button">Faucet</button>
        </div>

        {/* Middle 70%: NFTs */}
        <div className="user-nft-panel">
          <h3 className="section-title">Your NFTs</h3>
          <div className="nft-grid">
            {userNFTs.map((nft) => (
              <div key={nft.id} className="nft-card">
                <img src={nft.image} alt={nft.name} className="nft-image" />
                <div>{nft.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom 10%: Footer */}
        <div className="footer-panel">
          © 2025 ToanBm NFT Market
        </div>
      </div>
    </div>
  );
}

export default App;

// App.js
import { useState, useEffect } from "react";
import { connectWallet, disconnectWallet, switchNetwork } from "./connectWallet";
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

  async function connect() {
    const wallet = await connectWallet();
    if (wallet) {
      const address = await wallet.signer.getAddress();
      setSigner(wallet.signer);
      setWalletAddress(address);
    }
  }

  function disconnect() {
    disconnectWallet();
    setSigner(null);
    setWalletAddress("");
    setUserNFTs([]);
  }

  async function handleSwitchNetwork(chainKey) {
    if (chainKey === "DISCONNECT") {
      disconnect();
      return;
    }
    const chainInfo = CHAINS[chainKey];
    await switchNetwork(chainInfo);
    setSelectedChain(chainKey);
  }

  async function loadUserNFTs() {
    if (!signer) return;
    const contract = new Contract(CHAINS[selectedChain].contractAddress, MarketplaceAbi, signer);
    const fakeNFTs = [
      { id: 0, name: "NFT #0" },
      { id: 1, name: "NFT #1" }
    ];
    setUserNFTs(fakeNFTs);
  }

  useEffect(() => {
    loadUserNFTs();
  }, [signer]);

  return (
    <div className="container">
      <div className="left-panel">
        <MintNFT signer={signer} />
        <ListNFT signer={signer} />
      </div>

      <div className="center-panel">
        <div className="coming-soon">Coming Soon</div>
      </div>

      <div className="right-panel">
        <div className="wallet-bar">
          {!signer ? (
            <button className="wallet-button" onClick={connect}>Connect Wallet</button>
          ) : (
            <span>{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
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

        <div className="user-nfts">
          <h3>Your NFTs</h3>
          <div className="nft-grid">
            {userNFTs.map(nft => (
              <div key={nft.id} className="nft-card">{nft.name}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
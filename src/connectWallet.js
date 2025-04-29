import { BrowserProvider } from "ethers";

export async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    alert("Please install MetaMask or OKX Wallet!");
    return null;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });

    const provider = new BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const network = await provider.getNetwork();

    return {
      provider,
      signer,
      chainId: Number(network.chainId),
    };
  } catch (error) {
    console.error("connectWallet error:", error);
    alert("Failed to connect wallet!");
    return null;
  }
}

export async function switchNetwork(chainInfo) {
  try {
    await window.ethereum.request({
      method: "wallet_addEthereumChain",
      params: [{
        chainId: "0x" + chainInfo.chainId.toString(16),
        chainName: chainInfo.chainName,
        nativeCurrency: chainInfo.nativeCurrency,
        rpcUrls: chainInfo.rpcUrls,
        blockExplorerUrls: chainInfo.blockExplorerUrls,
      }],
    });
  } catch (error) {
    console.error("switchNetwork error:", error);
    alert("Failed to switch network!");
  }
}

export function disconnectWallet() {
  console.log("Disconnected frontend only");
}

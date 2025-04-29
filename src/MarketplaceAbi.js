// src/MarketplaceAbi.js
export const MarketplaceAbi = [
  {
    "inputs": [
      { "internalType": "address", "name": "nftAddress", "type": "address" },
      { "internalType": "uint256", "name": "tokenId", "type": "uint256" },
      { "internalType": "uint256", "name": "price", "type": "uint256" }
    ],
    "name": "listNFT",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

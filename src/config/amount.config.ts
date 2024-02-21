import { LocalNetworkURIKey, NetworkURIKey, TestNetworkURIKey, MainNetworkURIKey } from "@/types/networkType";
import { ethers } from "ethers";

const amountListMapLocal: Record<LocalNetworkURIKey, bigint[]> = {
  localhost: [ethers.parseEther('1')]
}


const amountListMapTest: Record<TestNetworkURIKey, bigint[]> = {
  sepolia: [ethers.parseEther('0.1')],
  arbitrumSepolia: [ethers.parseEther('0.1')],
  bscTestnet: [ethers.parseEther('0.1')],
  optimismSepolia: [ethers.parseEther('0.1')],
  polygonMumbai: [ethers.parseEther('0.1')],
}

const amountListmMapMain: Record<MainNetworkURIKey, bigint[]> = {
  arbitrum: [ethers.parseEther('0.1')],
  optimism: [ethers.parseEther('0.1')],
  ethereum: [ethers.parseEther('0.2')],
  bsc: [ethers.parseEther('0.1')],
  polygon: [ethers.parseEther('5')],
}

export const amountListMap: Record<NetworkURIKey, bigint[]> = {
  ...amountListMapLocal,
  ...amountListMapTest,
  ...amountListmMapMain
}

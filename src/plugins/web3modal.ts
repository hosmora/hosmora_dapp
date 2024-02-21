import { VITE_ENV_NAME, defaultNetwork } from '@/config/env.config'
import router from '@/router'
import { LocalNetworkURIKey, NetworkURIKey, TestNetworkURIKey } from '@/types/networkType'
import { getNetworkURIByHref } from '@/utils/libs'
import { getAccount, getNetwork } from '@wagmi/core'
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/vue'
import {
  localhost as localhostTemp,
  mainnet,
  arbitrum,
  bsc,
  optimism,
  polygon,
  sepolia,
  arbitrumSepolia,
  bscTestnet,
  optimismSepolia,
  polygonMumbai
} from 'viem/chains'

// const localhostRpc = { http: ['http://192.168.0.104:8545'] }
// const localhost = {
//   ...localhostTemp,
//   rpcUrls: {
//     default: localhostRpc,
//     public: localhostRpc,
//   },
// }
const localhost = localhostTemp

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = (() => {
  if (VITE_ENV_NAME === 'test_local') {
    return '39cb1349811d1a141e3cbf33f444e8a2'
  }
  if (VITE_ENV_NAME === 'test') {
    return '39cb1349811d1a141e3cbf33f444e8a2'
  }
  return '024c747ad4b1b69751c58bf32947b640'
})()

const metadataUrl = (() => {
  if (VITE_ENV_NAME === 'test_local') {
    return 'http://localhost:3000'
  }
  if (VITE_ENV_NAME === 'test') {
    return 'https://hosmora_dapp_test.4everland.app'
  }
  return 'https://hosmora.com'
})()

// 2. Create wagmiConfig
const metadata = {
  name: 'HosMora',
  description: 'Contract-based online mora protocol',
  url: metadataUrl,
  icons: [`${metadataUrl}/logo.png`]
}

type LocalChains = typeof localhost
type MainChains = typeof mainnet | typeof arbitrum | typeof bsc | typeof optimism | typeof polygon
type TestChains =
  | typeof sepolia
  | typeof arbitrumSepolia
  | typeof bscTestnet
  | typeof optimismSepolia
  | typeof polygonMumbai

type Chains = LocalChains | MainChains | TestChains

export const chainsNameURIMap: Record<NetworkURIKey, Chains> = (() => {
  if (VITE_ENV_NAME === 'test_local') {
    return {
      localhost
    } as Record<NetworkURIKey, Chains>
  }
  if (VITE_ENV_NAME === 'test') {
    return {
      sepolia,
      arbitrumSepolia,
      bscTestnet,
      optimismSepolia,
      polygonMumbai
    } as Record<NetworkURIKey, Chains>
  }
  return {
    // ethereum: mainnet,
    // arbitrum,
    // bsc,
    // optimism,
    polygon
  } as Record<NetworkURIKey, Chains>
})()

export const getURIKey = (_networkURI: string = '') => {
  const networkURI = _networkURI || getNetworkURIByHref()
  const key = (Object.keys(chainsNameURIMap).find(item => item.toLowerCase() === networkURI.toLowerCase()) ??
    defaultNetwork) as NetworkURIKey
  return key
}

export const getNetworkByURI = (networkURI: string = '') => {
  return chainsNameURIMap[getURIKey(networkURI)]
}
export const getNetworkURIKey = (chainId: number) => {
  return (Object.entries(chainsNameURIMap).find(([_, value]) => value.id === chainId)?.[0] ??
    defaultNetwork) as NetworkURIKey
}

export const chains: Chains[] = (() => {
  if (VITE_ENV_NAME === 'test_local') {
    return [localhost]
  }
  const currNetwork = getNetworkByURI()
  if (VITE_ENV_NAME === 'test') {
    return [
      currNetwork,
      ...[arbitrumSepolia, sepolia, bscTestnet, optimismSepolia, polygonMumbai].filter(item => item.id !== currNetwork.id)
    ]
  }
  return [
    currNetwork,
    ...[polygon].filter(item => item.id !== currNetwork.id)
    // ...[mainnet, arbitrum, bsc, optimism, polygon].filter(item => item.id !== currNetwork.id)
  ]
})()

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })
// 3. Create modal

export const web3Modal = createWeb3Modal({
  themeMode: 'light',
  themeVariables: {
    '--w3m-accent': '#0098ea'
  },
  wagmiConfig,
  projectId,
  chains
})
export const refreshWeb3ModalBalance = async () => {
  const { chain } = getNetwork()
  if (!chain) return
  const { address } = getAccount()
  if (!address) return
  await (web3Modal as any).syncBalance(address, chain)
}

export const subscribeStateOnce = async (
  callback: (state: { open: boolean; selectedNetworkId?: number | undefined }) => void
) => {
  const clear = web3Modal.subscribeState(({ open, selectedNetworkId }) => {
    clear()
    callback({ open, selectedNetworkId })
  })
}

export const awaitInitConnecting = async () => {
  for (let index = 0; index < 100; index++) {
    const res =  getAccount()
    if (!res.isConnecting) return;
    await new Promise<void>((resolve) => setTimeout(resolve, 1000))
  }
  throw new Error('connecting time out');
}

// refreshWeb3Modal()

export type LocalNetworkURIKey = 'localhost'
export type TestNetworkURIKey = 'sepolia' | 'arbitrumSepolia' | 'bscTestnet' | 'optimismSepolia' | 'polygonMumbai'
export type MainNetworkURIKey = 'ethereum' | 'arbitrum' | 'bsc' | 'optimism' | 'polygon'
// export type MainNetworkURIKey = 'polygon'

export type NetworkURIKey = LocalNetworkURIKey | TestNetworkURIKey | MainNetworkURIKey

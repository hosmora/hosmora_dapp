import { LocalNetworkURIKey, MainNetworkURIKey, NetworkURIKey, TestNetworkURIKey } from '@/types/networkType'

export const VITE_ENV_NAME = import.meta.env.VITE_ENV_NAME as 'prod' | 'test' | 'test_local' | undefined

export const referrerOrigin = (() => {
  if (VITE_ENV_NAME === 'test_local') {
    return 'http://localhost:5173'
  }
  if (VITE_ENV_NAME === 'test' ) {
    return 'https://hosmora_uidmap_test.4everland.app'
  }
  return 'https://ref.hosmora.com'
})()

const _siweMessage = ({
  host,
  from,
  origin,
  chainId,
  nonce,
  time,
  version
}: {
  host: string
  origin: string
  from: string
  chainId: number
  nonce: number
  time: string
  version: number
}) => {
  const text = `${host} wants you to sign in with your Ethereum account:\n${from.toLowerCase()}\n\nWelcome to the hosmora. please sign this message to log in to the hosmora\n\nURI: ${origin}\nVersion: ${version}\nChain ID: ${chainId}\nNonce: ${nonce}\nIssued At: ${time}`
  return text
}

const signTextLocal: Record<LocalNetworkURIKey, ((from: string) => string) | undefined> = {
  localhost: from =>
    _siweMessage({
      host: 'localhost:3000',
      origin: 'http://localhost:3000',
      from,
      chainId: 1337,
      nonce: 43176833,
      time: '2024-01-02T12:00:00.000Z',
      version: 1
    })
}

const signTextTest: Record<TestNetworkURIKey, ((from: string) => string) | undefined> = {
  sepolia: from =>
    _siweMessage({
      host: 'hosmora_dapp_test.4everland.app',
      origin: 'https://hosmora_dapp_test.4everland.app',
      from,
      chainId: 11155111,
      nonce: 43976001,
      time: '2024-01-08T12:00:00.000Z',
      version: 1
    }),
  arbitrumSepolia: from =>
    _siweMessage({
      host: 'hosmora_dapp_test.4everland.app',
      origin: 'https://hosmora_dapp_test.4everland.app',
      from,
      chainId: 421614,
      nonce: 43976002,
      time: '2024-01-08T12:00:00.000Z',
      version: 1
    }),
  bscTestnet: from =>
    _siweMessage({
      host: 'hosmora_dapp_test.4everland.app',
      origin: 'https://hosmora_dapp_test.4everland.app',
      from,
      chainId: 97,
      nonce: 43976003,
      time: '2024-01-08T12:00:00.000Z',
      version: 1
    }),
  optimismSepolia: from =>
    _siweMessage({
      host: 'hosmora_dapp_test.4everland.app',
      origin: 'https://hosmora_dapp_test.4everland.app',
      from,
      chainId: 11155420,
      nonce: 43976004,
      time: '2024-01-08T12:00:00.000Z',
      version: 1
    }),
  polygonMumbai: from =>
    _siweMessage({
      host: 'hosmora_dapp_test.4everland.app',
      origin: 'https://hosmora_dapp_test.4everland.app',
      from,
      chainId: 80001,
      nonce: 43976005,
      time: '2024-01-08T12:00:00.000Z',
      version: 1
    })
}

const signTextMain: Record<MainNetworkURIKey, ((from: string) => string) | undefined> = {
  ethereum: from =>
    _siweMessage({
      host: 'hosmora.com',
      origin: 'https://hosmora.com',
      from,
      chainId: 1,
      nonce: 43976201,
      time: '2024-01-17T12:00:00.000Z',
      version: 1
    }),
  arbitrum: from =>
    _siweMessage({
      host: 'hosmora.com',
      origin: 'https://hosmora.com',
      from,
      chainId: 42161,
      nonce: 43976202,
      time: '2024-01-17T12:00:00.000Z',
      version: 1
    }),
  bsc: from =>
    _siweMessage({
      host: 'hosmora.com',
      origin: 'https://hosmora.com',
      from,
      chainId: 56,
      nonce: 43976204,
      time: '2024-01-17T12:00:00.000Z',
      version: 1
    }),
  optimism: from =>
    _siweMessage({
      host: 'hosmora.com',
      origin: 'https://hosmora.com',
      from,
      chainId: 10,
      nonce: 43976204,
      time: '2024-01-17T12:00:00.000Z',
      version: 1
    }),
  polygon: from =>
    _siweMessage({
      host: 'hosmora.com',
      origin: 'https://hosmora.com',
      from,
      chainId: 137,
      nonce: 43976205,
      time: '2024-01-17T12:00:00.000Z',
      version: 1
    })
}

export const signText: Record<NetworkURIKey, ((from: string) => string) | undefined> = {...signTextLocal, ...signTextTest, ...signTextMain}
// export const signText = `mora info signer c4e5c88b-a5ba-411e-80e1-1a63e147b8a9`
export const defaultNetwork: NetworkURIKey = (() => {
  if (VITE_ENV_NAME === 'test_local') return 'localhost';
  if (VITE_ENV_NAME === 'test') return 'polygonMumbai';
  return 'polygon';
})()

type ContractAddress = {
  hosMoraAddress: `0x${string}`
  distributionAmountAddress: `0x${string}`
  gameLogSearchAddress: `0x${string}`
  referrerLevelAddress: `0x${string}`;
}

const contractAddressMapLocal: Record<LocalNetworkURIKey, ContractAddress> = {
  localhost: {
    hosMoraAddress: '0x5953393f7b44588C59ba7cC30ff1296a169Af53F',
    distributionAmountAddress: '0x9D88c93bbeE20C9b5a3E5cCDc613E959E6AB94F3',
    gameLogSearchAddress: '0x54ad085133900105b74B04a879F550e98B4a88b1',
    referrerLevelAddress: '0xbB62bE4d99E069932182e6A5f7B8cd1b056E36E6',
  },
}

const contractAddressMapTest: Record<TestNetworkURIKey, ContractAddress> = {
  sepolia: {
    hosMoraAddress: '0xa687ad8C42642Dd38145A716EAC4E1701855E0a0',
    distributionAmountAddress: '0x0EB91a6BAc0D273A8745b0E504f8E49Ec75EFE72',
    gameLogSearchAddress: '0x8ecfE9dcfe5e07b3824DA29bac8BFa2E91732c27',
    referrerLevelAddress: '0xc5C1ED09fbb6aCf71DA71B7f02A880d2e2Ce8d65',
  },
  arbitrumSepolia: {
    hosMoraAddress: '0xa687ad8C42642Dd38145A716EAC4E1701855E0a0',
    distributionAmountAddress: '0x0EB91a6BAc0D273A8745b0E504f8E49Ec75EFE72',
    gameLogSearchAddress: '0x8ecfE9dcfe5e07b3824DA29bac8BFa2E91732c27',
    referrerLevelAddress: '0xc5C1ED09fbb6aCf71DA71B7f02A880d2e2Ce8d65',
  },
  bscTestnet: {
    hosMoraAddress: '0x818f86F2Fe27a09501eDaba34EdbCb891BC93bF8',
    distributionAmountAddress: '0xF4Aa635cD9897894eb6Ca88C6c87B4A797EdeB41',
    gameLogSearchAddress: '0x1278713529C92CF99a5347C322800Da748aa4055',
    referrerLevelAddress: '0x43ab9885a40D2E711777cF26Fc5c5f9c5f986C1b',
  },
  optimismSepolia: {
    hosMoraAddress: '0xa687ad8C42642Dd38145A716EAC4E1701855E0a0',
    distributionAmountAddress: '0x0EB91a6BAc0D273A8745b0E504f8E49Ec75EFE72',
    gameLogSearchAddress: '0x8ecfE9dcfe5e07b3824DA29bac8BFa2E91732c27',
    referrerLevelAddress: '0xc5C1ED09fbb6aCf71DA71B7f02A880d2e2Ce8d65',
  },
  polygonMumbai: {
    hosMoraAddress: '0xa687ad8C42642Dd38145A716EAC4E1701855E0a0',
    distributionAmountAddress: '0x0EB91a6BAc0D273A8745b0E504f8E49Ec75EFE72',
    gameLogSearchAddress: '0x8ecfE9dcfe5e07b3824DA29bac8BFa2E91732c27',
    referrerLevelAddress: '0xc5C1ED09fbb6aCf71DA71B7f02A880d2e2Ce8d65',
  },
}

const contractAddressMapMain: Record<MainNetworkURIKey, ContractAddress> = {
  ethereum: {
    hosMoraAddress: '0x953Cb654189bD2f2b87A50ea7BfDB03ba6F74B19',
    distributionAmountAddress: '0xc7E3b922DF5c8Fd0587bae4ea314A1C642FEFFA8',
    gameLogSearchAddress: '0xFD69704Be13a8dAdb16120D98dEbBfD2d92e8eff',
    referrerLevelAddress: '0x03d585D680e837845eB297F732eA77ABBE839825',
  },
  arbitrum: {
    hosMoraAddress: '0x953Cb654189bD2f2b87A50ea7BfDB03ba6F74B19',
    distributionAmountAddress: '0xc7E3b922DF5c8Fd0587bae4ea314A1C642FEFFA8',
    gameLogSearchAddress: '0xFD69704Be13a8dAdb16120D98dEbBfD2d92e8eff',
    referrerLevelAddress: '0x03d585D680e837845eB297F732eA77ABBE839825',
  },
  bsc: {
    hosMoraAddress: '0x953Cb654189bD2f2b87A50ea7BfDB03ba6F74B19',
    distributionAmountAddress: '0xc7E3b922DF5c8Fd0587bae4ea314A1C642FEFFA8',
    gameLogSearchAddress: '0xFD69704Be13a8dAdb16120D98dEbBfD2d92e8eff',
    referrerLevelAddress: '0x03d585D680e837845eB297F732eA77ABBE839825',
  },
  optimism: {
    hosMoraAddress: '0x953Cb654189bD2f2b87A50ea7BfDB03ba6F74B19',
    distributionAmountAddress: '0xc7E3b922DF5c8Fd0587bae4ea314A1C642FEFFA8',
    gameLogSearchAddress: '0xFD69704Be13a8dAdb16120D98dEbBfD2d92e8eff',
    referrerLevelAddress: '0x03d585D680e837845eB297F732eA77ABBE839825',
  },
  polygon: {
    hosMoraAddress: '0x4De299D5DB87C66328b6F8d23B0cd4C5249415E4',
    distributionAmountAddress: '0x751775Ac2e9b0FB4E33Cfa8aDCa14A3f170CEDf4',
    gameLogSearchAddress: '0xC7bdd8C6553327A94c3Dc3024B40Ca1D5516232b',
    referrerLevelAddress: '0x8ecfE9dcfe5e07b3824DA29bac8BFa2E91732c27',
  },
}

export const contractAddressMap: Record<NetworkURIKey, ContractAddress> = {...contractAddressMapLocal, ...contractAddressMapTest, ...contractAddressMapMain}

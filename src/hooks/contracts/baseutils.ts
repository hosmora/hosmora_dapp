import { getNetwork, getPublicClient, getAccount, sendTransaction } from '@wagmi/core'
import { useAppStore } from '@/store/app'
import { gasBaseCalculate } from '@/utils/web3'
import { getNetworkByURI, getNetworkURIKey } from '@/plugins/web3modal'
import { contractAddressMap } from '@/config/env.config'

export const interactivePreVerify = () => {
  const _network = getNetwork()
  if (!_network.chain) throw new Error('Please connect the wallet first')
  const { address } = getAccount()
  if (!address) throw new Error('Please connect the wallet first')
  const { signature, signatureAddress } = useAppStore()
  if (!signature) throw new Error('Please connect the wallet first')
  if (!signatureAddress) throw new Error('Please connect the wallet first')
  if (address !== signatureAddress) throw new Error('Please connect the wallet first')
  const { id: chainId } = _network.chain
  const client = getPublicClient({ chainId })

  return {
    client,
    signature,
    address,
    network: _network,
    contractAddress: contractAddressMap[getNetworkURIKey(chainId)]
  }
}

export const getUrINetworkInfos = () => {
  const _network = getNetworkByURI()
  const client = getPublicClient({ chainId: _network.id })

  return {
    client,
    network: _network,
    contractAddress: contractAddressMap[getNetworkURIKey(_network.id)]
  };
}

export const sendTransactionByData = async (sendParam: {
  data: `0x${string}`;
  value?: bigint;
  to?: `0x${string}`;
  gas?: bigint
}) => {
  const { client, address } = interactivePreVerify();
  const isDiyGas = sendParam.gas && sendParam.gas > 0n
  const gasLimit = await (async() => {
    if (isDiyGas) return 0n
    return await client.estimateGas({
      account: address,
      ...sendParam,
    }).catch(err => {
      if ((err as Error).message.includes('exceeds the balance of the account')) {
        return Promise.reject(new Error('Insufficient balance'))
      }
      return Promise.reject(err)
    });
  })()
  if (isDiyGas) {
    await client.call({account: address, ...sendParam})
  }
  const gasPrice = await client.getGasPrice();

  const tx = await sendTransaction({
    ...sendParam,
    to: sendParam.to ?? '',
    gas: isDiyGas ? sendParam.gas : gasBaseCalculate(gasLimit),
    gasPrice: gasBaseCalculate(gasPrice),
  });
  return {
    tx,
    wait: () => client.waitForTransactionReceipt(tx),
  };
};


import ReferrerLevelAbi from '@/assets/abis/ReferrerLevel.json'
import { interactivePreVerify, sendTransactionByData, getUrINetworkInfos } from './baseutils'
import { ethers } from 'ethers'
import { FeeLevel } from '@/types/baseType'


const getFeeLevel = async (referrer: string) => {
  const { client, contractAddress: {referrerLevelAddress} } = getUrINetworkInfos()
  const data = await client.readContract({
    address: referrerLevelAddress,
    abi: ReferrerLevelAbi,
    functionName: 'feeLevel',
    args: [referrer]
  })
  return data as FeeLevel
}

const getReferrerWinFeeRatio = async (referrer: string) => {
  const { client, contractAddress: {referrerLevelAddress} } = getUrINetworkInfos()
  const data = await client.readContract({
    address: referrerLevelAddress,
    abi: ReferrerLevelAbi,
    functionName: 'getReferrerWinFeeRatio',
    args: [referrer]
  })
  return data as bigint
}

const getReferrerFeeRatio =async (referrer: string) => {
  const { client, contractAddress: {referrerLevelAddress} } = interactivePreVerify()
  const data = await client.readContract({
    address: referrerLevelAddress,
    abi: ReferrerLevelAbi,
    functionName: 'getReferrerFeeRatio',
    args: [referrer]
  })
  return data as bigint
}

const getNewcomerBindCount = async (referrer: string) => {
  const { client, contractAddress: {referrerLevelAddress} } = interactivePreVerify()
  const data = await client.readContract({
    address: referrerLevelAddress,
    abi: ReferrerLevelAbi,
    functionName: 'getNewcomerBindCount',
    args: [referrer]
  })
  return data as bigint
}
const getAccountLevelExp = async (referrer: string, level:FeeLevel) => {
  const { client, contractAddress: {referrerLevelAddress} } = interactivePreVerify()
  const data = await client.readContract({
    address: referrerLevelAddress,
    abi: ReferrerLevelAbi,
    functionName: 'getAccountLevelExp',
    args: [referrer, level]
  })
  return data as bigint
}


const getIsReferrerDiyFeeRatio = async (referrer: string) => {
  const { client, contractAddress: {referrerLevelAddress} } = interactivePreVerify()
  const data = await client.readContract({
    address: referrerLevelAddress,
    abi: ReferrerLevelAbi,
    functionName: 'isReferrerDiyFeeRatio',
    args: [referrer]
  })
  return data as boolean
}

const setReferrerFeeRatio = async (referrer: string, feeRotio: bigint) => {
  if (referrer && !ethers.isAddress(referrer)) throw new Error('referrer is not address')
  if (feeRotio < 0n)  throw new Error('feeRotio cannot be less than 0')
  const { contractAddress: {referrerLevelAddress} } = interactivePreVerify()
  const contract = new ethers.Contract(referrerLevelAddress, ReferrerLevelAbi)
  const functionInterface = contract.interface.getFunction('setReferrerFeeRatio')
  if (!functionInterface) throw new Error('Contract function not obtained')

  const data = contract.interface.encodeFunctionData(functionInterface, [referrer, feeRotio])
  const { wait } = await sendTransactionByData({ data: data as `0x${string}`, to: referrerLevelAddress, })
  await wait()
}

const closeDiyReferrerFeeRatio = async (referrer: string) => {
  if (referrer && !ethers.isAddress(referrer)) throw new Error('referrer is not address')
  const { contractAddress: {referrerLevelAddress} } = interactivePreVerify()
  const contract = new ethers.Contract(referrerLevelAddress, ReferrerLevelAbi)
  const functionInterface = contract.interface.getFunction('closeDiyReferrerFeeRatio')
  if (!functionInterface) throw new Error('Contract function not obtained')

  const data = contract.interface.encodeFunctionData(functionInterface, [referrer])
  const { wait } = await sendTransactionByData({ data: data as `0x${string}`, to: referrerLevelAddress, })
  await wait()
}

const payUpgradeAction = async (referrer: string, value: bigint) => {
  if (referrer && !ethers.isAddress(referrer)) throw new Error('referrer is not address')
  const { contractAddress: {referrerLevelAddress} } = interactivePreVerify()
  const contract = new ethers.Contract(referrerLevelAddress, ReferrerLevelAbi)
  const functionInterface = contract.interface.getFunction('payUpgradeAction')
  if (!functionInterface) throw new Error('Contract function not obtained')

  const data = contract.interface.encodeFunctionData(functionInterface, [referrer])
  const { wait } = await sendTransactionByData({ data: data as `0x${string}`, to: referrerLevelAddress, value })
  await wait()

}

export const useReferrerLevel = () => ({
  getFeeLevel,
  getReferrerWinFeeRatio,
  getReferrerFeeRatio,
  getNewcomerBindCount,
  getAccountLevelExp,
  getIsReferrerDiyFeeRatio,
  setReferrerFeeRatio,
  payUpgradeAction,
  closeDiyReferrerFeeRatio
})

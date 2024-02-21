import HosMoraContractAbi from '@/assets/abis/HosMoraContractAbi.json'
import { interactivePreVerify, sendTransactionByData } from './baseutils'
import { ethers } from 'ethers'
import { random } from 'lodash'
import { getUUID, getWeb3ErrorMessage } from '@/utils/web3'
import { BetType } from '@/types/baseType'
import { WinAmountDistribute } from './DistributionAmount'


export type GameInfo = {
  bout: bigint
  amount: bigint
  p1Address: `0x${string}`
  p1Referrer: `0x${string}`
  p1Bet: BetType
  p1Timestamp: bigint
  p2Address: `0x${string}`
  p2Referrer: `0x${string}`
  p2Bet: BetType
  p2Timestamp: bigint
  winAmountDistribute: WinAmountDistribute
}

export type GameInfoPagination = {
  total: bigint,
  page: number,
  limit: number,
  infos: GameInfo[]
}

const _getMoraTypeRandom = (uid: bigint, betType: BetType) => {
  if (uid < 100n) throw new Error('uid error')
  const secondDigit = uid % 100n
  const between = (() => {
    if (secondDigit < 17n) {
      return { [BetType.Rock]: [1, 40], [BetType.Scissors]: [41, 80], [BetType.Cloth]: [81, 120] }
    }
    if (secondDigit < 33n) {
      return { [BetType.Rock]: [1, 40], [BetType.Cloth]: [41, 80], [BetType.Scissors]: [81, 120] }
    }
    if (secondDigit < 50n) {
      return { [BetType.Scissors]: [1, 40], [BetType.Rock]: [41, 80], [BetType.Cloth]: [81, 120] }
    }
    if (secondDigit < 66n) {
      return { [BetType.Scissors]: [1, 40], [BetType.Cloth]: [41, 80], [BetType.Rock]: [81, 120] }
    }
    if (secondDigit < 83n) {
      return { [BetType.Cloth]: [1, 40], [BetType.Scissors]: [41, 80], [BetType.Rock]: [81, 120] }
    }
    return { [BetType.Cloth]: [1, 40], [BetType.Rock]: [41, 80], [BetType.Scissors]: [81, 120] }
  })()
  return BigInt(random(between[betType][0], between[betType][1]))
}

const _moraOnceHashFactory = (tokenHash: string, address: `0x${string}`, betType: BetType) => {
  const uid = getUUID()
  const types = ['bytes32', 'string', 'uint256', 'address', 'uint256']
  const values = [
    tokenHash,
    'mora hash 3439f0fa-7319-4d7a-b592-a9a85d4ba1fe',
    uid,
    address,
    _getMoraTypeRandom(uid, betType)
  ]
  const hash = ethers.solidityPackedKeccak256(types, values)
  return { hash, uid }
}

const getTokenHash = async () => {
  const { client, address, signature, contractAddress: {hosMoraAddress} } = interactivePreVerify()
  const data = await client.readContract({
    address: hosMoraAddress,
    abi: HosMoraContractAbi,
    functionName: 'getTokenHash',
    args: [address, signature]
  })
  return data as string
}

const getCurrentGameInfo = async () => {
  const { client, address, signature, contractAddress: {hosMoraAddress} } = interactivePreVerify()
  const data = await client.readContract({
    address: hosMoraAddress,
    abi: HosMoraContractAbi,
    functionName: 'getCurrentGameInfo',
    args: [address, signature]
  })
  return data as GameInfo
}

const moraOnce = async (betType: BetType, amount: number, referrer?: string | null) => {
  if (referrer && !ethers.isAddress(referrer)) throw new Error('referrer is not address')
  const { address, client, contractAddress: {hosMoraAddress} } = interactivePreVerify()
  if (referrer) {
    const code = await client.getBytecode({address: referrer as `0x${string}`})
    if ((code?.length ?? 0) > 2) {
      throw new Error('referrer is contract address')
    }
  }

  const tokenHash = await getTokenHash()
  const oldInfo = await getCurrentGameInfo()
  if (oldInfo.bout != 0n) throw new Error('You have a mora round')
  const contract = new ethers.Contract(hosMoraAddress, HosMoraContractAbi)
  const functionInterface = contract.interface.getFunction('moraOnce')
  if (!functionInterface) throw new Error('Contract function not obtained')
  if (amount <= 0) throw new Error('amount cannot be less than 0')
  const value = ethers.parseEther(`${amount}`)

  const { hash, uid } = _moraOnceHashFactory(tokenHash, address, betType)
  const data = contract.interface.encodeFunctionData(functionInterface, [hash, uid, (referrer || ethers.ZeroAddress)])
  const { wait } = await sendTransactionByData({ data: data as `0x${string}`, to: hosMoraAddress, value, gas: 1235705n })
  const res = await wait()
  const block = await client.getBlock({ blockNumber: res.blockNumber })
  const { topics } = res.logs.find(
    res => res.topics[0] === '0x76b24f9176d788094d230314bc6a369ad0d4f0c63a2d00e242b13fd709708c88'
  )!
  const info: GameInfo = {
    bout: ethers.toBigInt(topics[3]!),
    amount: value,
    p1Address: address,
    p1Referrer: (referrer || ethers.ZeroAddress) as `0x${string}`,
    p1Bet: betType,
    p1Timestamp: block.timestamp,
    p2Address: ethers.ZeroAddress as `0x${string}`,
    p2Referrer: ethers.ZeroAddress as `0x${string}`,
    p2Bet: 0,
    p2Timestamp: 0n,
    winAmountDistribute: {
      platform: 0n,
      lastingBind: 0n,
      referrer: 0n,
      player: 0n,
      winAmount: 0n
    }
  }
  return info
}
const claimReward = async () => {
  const { contractAddress: {hosMoraAddress} } = interactivePreVerify()

  const contract = new ethers.Contract(hosMoraAddress, HosMoraContractAbi)
  const functionInterface = contract.interface.getFunction('claimReward')
  if (!functionInterface) throw new Error('Contract function not obtained')
  const data = contract.interface.encodeFunctionData(functionInterface)
  const { wait } = await sendTransactionByData({ data: data as `0x${string}`, to: hosMoraAddress })
  await wait()
}

const cancelGame = async () => {
  const { contractAddress: {hosMoraAddress} } = interactivePreVerify()
  const contract = new ethers.Contract(hosMoraAddress, HosMoraContractAbi)
  const functionInterface = contract.interface.getFunction('cancelGame')
  if (!functionInterface) throw new Error('Contract function not obtained')
  const data = contract.interface.encodeFunctionData(functionInterface)
  const { wait } = await sendTransactionByData({ data: data as `0x${string}`, to: hosMoraAddress })
  await wait()
}

const getNoReceiveWinAmount = async () => {
  const { client, address, contractAddress: {hosMoraAddress} } = interactivePreVerify()
  const data = await client.readContract({
    address: hosMoraAddress,
    abi: HosMoraContractAbi,
    functionName: 'getNoReceiveWinAmount',
    args: [address]
  }) as GameInfo
  if (data.bout === 0n) return;
  return data
}


export const useHosMoraContract = () => ({
  moraOnce,
  claimReward,
  getCurrentGameInfo,
  cancelGame,
  getNoReceiveWinAmount,
})

import GameLogSearchAbi from '@/assets/abis/GameLogSearch.json'
import { getUrINetworkInfos, interactivePreVerify } from './baseutils'
import { ethers } from 'ethers'
import { GameInfoPagination, GameInfo, useHosMoraContract } from './HosMora'

const getGameLog = async ({
  page,
  limit,
  account = ethers.ZeroAddress,
  referrer = ethers.ZeroAddress
}: {
  page: number
  limit: number
  account?: string
  referrer?: string
}) => {
  const { client, contractAddress } = getUrINetworkInfos()
  const data = await client.readContract({
    address: contractAddress.gameLogSearchAddress,
    abi: GameLogSearchAbi,
    functionName: 'getGameLog',
    args: [page, limit, account, referrer]
  })
  return data as GameInfoPagination
}



export type LastingBindGameInfo = {
  p1BindReferrer: `0x${string}`,
  p2BindReferrer: `0x${string}`,
  gameinfo: GameInfo
}
export  type LastingBindGameLogPagination = {
  total: bigint,
  page: number,
  limit: number,
  infos: LastingBindGameInfo[]
}

const getGameLogLastingBind = async ({
  page,
  limit,
  account = ethers.ZeroAddress,
  referrer = ethers.ZeroAddress
}: {
  page: number
  limit: number
  account?: string
  referrer?: string
}) => {
  const { client, contractAddress } = getUrINetworkInfos()
  const data = await client.readContract({
    address: contractAddress.gameLogSearchAddress,
    abi: GameLogSearchAbi,
    functionName: 'getGameLogLastingBind',
    args: [page, limit, account, referrer]
  })
  return data as LastingBindGameLogPagination
}


const getIncomeCount = async ({
  account = ethers.ZeroAddress,
  referrer = ethers.ZeroAddress
}: {
  account?: string
  referrer?: string
}) => {
  const { client, contractAddress } = getUrINetworkInfos()
  const res = await client.readContract({
    address: contractAddress.gameLogSearchAddress,
    abi: GameLogSearchAbi,
    functionName: 'getIncomeCount',
    args: [account, referrer]
  })
  return (res as [bigint, boolean])

}

const getGameInfoedByBout = async (bout: bigint, amount: bigint) => {
  const { client, contractAddress: {gameLogSearchAddress} } = interactivePreVerify()
  try {
    const data = await client.readContract({
      address: gameLogSearchAddress,
      abi: GameLogSearchAbi,
      functionName: 'getGameInfoedByBout',
      args: [bout, amount]
    })
    return data as GameInfo
  } catch (error) {
    console.error(error)
  }
}

const getGameInfoAndProgressByBout = async (bout: bigint, amount: bigint) => {
  const { getCurrentGameInfo } = useHosMoraContract()
  const currinfo = await getCurrentGameInfo()
  if (currinfo.bout !== 0n) return currinfo;
  return await getGameInfoedByBout(bout, amount)
}

export const useGameLogSearch = () => ({
  getGameLog,
  getGameLogLastingBind,
  getIncomeCount,
  getGameInfoedByBout,
  getGameInfoAndProgressByBout
})

import { FeeLevel } from "@/types/baseType";
import { LocalNetworkURIKey, MainNetworkURIKey, NetworkURIKey, TestNetworkURIKey } from "@/types/networkType";
import { ethers } from "ethers";

type LevelUpExps = [bigint, bigint, bigint, bigint, bigint]


const levelUpExpsMapLocal: Record<LocalNetworkURIKey, LevelUpExps | undefined> = {
  localhost: [
    ethers.parseEther('500'),
    ethers.parseEther('5000'),
    ethers.parseEther('50000'),
    ethers.parseEther('500000'),
    ethers.parseEther('5000000'),
  ],
}

const levelUpExpsMapTest: Record<TestNetworkURIKey, LevelUpExps | undefined> = {
  sepolia: [
    ethers.parseEther('100'),
    ethers.parseEther('1000'),
    ethers.parseEther('10000'),
    ethers.parseEther('100000'),
    ethers.parseEther('1000000'),
  ],
  arbitrumSepolia: [
    ethers.parseEther('200'),
    ethers.parseEther('2000'),
    ethers.parseEther('20000'),
    ethers.parseEther('200000'),
    ethers.parseEther('2000000'),
  ],
  bscTestnet: [
    ethers.parseEther('300'),
    ethers.parseEther('3000'),
    ethers.parseEther('30000'),
    ethers.parseEther('300000'),
    ethers.parseEther('3000000'),
  ],
  optimismSepolia: [
    ethers.parseEther('400'),
    ethers.parseEther('4000'),
    ethers.parseEther('40000'),
    ethers.parseEther('400000'),
    ethers.parseEther('4000000'),
  ],
  polygonMumbai: [
    ethers.parseEther('500'),
    ethers.parseEther('5000'),
    ethers.parseEther('50000'),
    ethers.parseEther('500000'),
    ethers.parseEther('5000000'),
  ],
}

const levelUpExpsMapMain: Record<MainNetworkURIKey, LevelUpExps | undefined> = {
  ethereum: [
    ethers.parseEther('100'),
    ethers.parseEther('1000'),
    ethers.parseEther('10000'),
    ethers.parseEther('100000'),
    ethers.parseEther('1000000'),
  ],
  arbitrum: [
    ethers.parseEther('200'),
    ethers.parseEther('2000'),
    ethers.parseEther('20000'),
    ethers.parseEther('200000'),
    ethers.parseEther('2000000'),
  ],
  bsc: [
    ethers.parseEther('300'),
    ethers.parseEther('3000'),
    ethers.parseEther('30000'),
    ethers.parseEther('300000'),
    ethers.parseEther('3000000'),
  ],
  optimism: [
    ethers.parseEther('400'),
    ethers.parseEther('4000'),
    ethers.parseEther('40000'),
    ethers.parseEther('400000'),
    ethers.parseEther('4000000'),
  ],
  polygon: [
    ethers.parseEther('500'),
    ethers.parseEther('5000'),
    ethers.parseEther('50000'),
    ethers.parseEther('500000'),
    ethers.parseEther('5000000'),
  ],
}

export const levelUpExpsMap: Record<NetworkURIKey, LevelUpExps | undefined> = {
  ...levelUpExpsMapLocal,
  ...levelUpExpsMapTest,
  ...levelUpExpsMapMain,
}
// 无邀请人的平台手续费 10%
export const feeRatioNoReferrer = 100000n

// 永久绑定分得利润（从平台手续费中扣除）0.1%
export const lastingBindFeeRatio = 1000n

// 邀请人手续费配置
export const feeRatioByLevel: Record<FeeLevel, bigint> = {
  [FeeLevel.level1]: 6000n,
  [FeeLevel.level2]: 8000n,
  [FeeLevel.level3]: 10000n,
  [FeeLevel.level4]: 12000n,
  [FeeLevel.level5]: 14000n,
  [FeeLevel.level6]: 18000n,
}

// 平台手续费配置
export const feePlatformRatioByLevel: Record<FeeLevel, bigint> = {
  [FeeLevel.level1]: 90000n,
  [FeeLevel.level2]: 80000n,
  [FeeLevel.level3]: 68000n,
  [FeeLevel.level4]: 54000n,
  [FeeLevel.level5]: 38000n,
  [FeeLevel.level6]: 18000n,
}

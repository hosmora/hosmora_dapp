import { computed, ref, watch } from 'vue'
import { watchAccount, getAccount, getNetwork, watchNetwork, switchNetwork, signMessage, disconnect } from '@wagmi/core'
import { useAppStore } from '@/store/app'
import {
  awaitInitConnecting,
  chains,
  getNetworkByURI,
  getNetworkURIKey,
  getURIKey,
  refreshWeb3ModalBalance,
  subscribeStateOnce
} from '@/plugins/web3modal'
import router from '@/router'
import { signText } from '@/config/env.config'
import { useWeb3Modal, useWeb3ModalState } from '@web3modal/wagmi/vue'
const { open, close: closeWeb3Modal } = useWeb3Modal()
import { watchOnce, useDebounceFn } from '@vueuse/core'

const isLoginLock = ref(false)

const isConnectWallet = ref(false)
const address = ref<`0x${string}`>()

const networkURIKey = computed(() => getURIKey(router.currentRoute.value.params.network as string))
const networkURL = computed(() => getNetworkByURI(networkURIKey.value))

const chainId = ref<number>(0)

const networkChain = computed(() => chains.find(item => item.id === chainId.value))

const isConnectNetworkURI = computed(() => {
  return networkURL.value.id === chainId.value
})
const isSignature = computed(() => {
  const { signatureAddress, signatureNetwork } = useAppStore()
  return networkURIKey.value === signatureNetwork && address.value === signatureAddress
})
const isConnectWalletNetwork = computed(() => {
  return isConnectWallet.value && isConnectNetworkURI.value && isSignature.value
})

watch(isConnectWallet, value => {
  if (value) timingRefreshBalance()
  const { address: _address } = getAccount()
  address.value = _address
})

let isTimingRefreshBalance = false
const timingRefreshBalance = async () => {
  if (isTimingRefreshBalance) return
  isTimingRefreshBalance = true
  while (isConnectWallet.value) {
    await refreshWeb3ModalBalance()
    await new Promise<void>(resolve => setTimeout(resolve, 5000))
  }
  isTimingRefreshBalance = false
}
let isInitState = false

const initState = () => {
  if (isInitState) return
  isInitState = true
  const _network = getNetwork()
  const { isConnected } = getAccount()
  if (_network.chain) {
    chainId.value = _network.chain.id
  }
  isConnectWallet.value = isConnected

  watchAccount(({ isConnected, address: _address }) => {
    isConnectWallet.value = isConnected
    address.value = _address;
  })

  watchNetwork(network => {
    const chainIdTemp = network.chain?.id ?? 0
    chainId.value = chainIdTemp
    if (chains.some(item => item.id === chainIdTemp) && !isLoginLock.value) {
      (async () => {
        const keyURI = getNetworkURIKey(chainIdTemp)
        const { query } = router.currentRoute.value
        const { open } = useWeb3ModalState()
        closeWeb3Modal()
        await router.replace({ name: 'Mora', params: { network: keyURI }, query })
        if (open && !isConnectWalletNetwork.value) {
          login()
        }
      })()
    }
  })
}

const switchNetworkURI = () => switchNetwork({ chainId: networkURL.value.id })

const signMessageHandler = useDebounceFn(async () => {
  const { isConnected, address } = getAccount()
  if (!isConnected) return
  if (!address) return
  const { chain } = getNetwork()
  if (!chain) return
  const networkKey = getNetworkURIKey(chain.id)
  const metadataF = signText[networkKey]
  if (!metadataF) throw new Error('Network error')
  await new Promise<void>((resolve, reject) => {
    (async () => {
      let isTimeout = false
      window.setTimeout(() => {
        disconnect()
        isTimeout = true
        reject(new Error('sign message timeout'))
      }, 1000 * 80)
      const signature = await signMessage({
        message: metadataF(address)
      })
      if (isTimeout) return
      const { setSignature } = useAppStore()
      setSignature(address!, signature, networkKey)
      resolve()
    })()
  })
}, 100)

const connectWallet = async () => {
  await awaitInitConnecting();
  const account = getAccount()
  if (account.isConnected || account.isConnecting) {
    if (!isConnectNetworkURI.value) await switchNetworkURI()
    if (!isSignature.value) await signMessageHandler()
    return
  }
  await open({ view: 'Connect' })

  await new Promise((resolve, reject) => {
    const clearFun = watchAccount(account => {
      if (account.isConnected) {
        clearFun()
        return resolve(account)
      }
    })
    subscribeStateOnce(() => {
      const account = getAccount()
      if (!account.isConnected) {
        reject(new Error('User rejected the request.'))
      }
    })
  })
  if (!isConnectNetworkURI.value) await switchNetworkURI()
  if (isSignature.value) return
  await signMessageHandler()
}

const login = async () => {
  isLoginLock.value = true
  await connectWallet().finally(() => (isLoginLock.value = false))
}

const verifyLogin = async () => {
  if (isConnectWalletNetwork.value) {
    return true
  }
  if (isLoginLock.value) {
    await new Promise<void>(resolve => {
      watchOnce(isLoginLock, () => {
        resolve()
      })
    })
    return isConnectWalletNetwork.value
  }
  await login()
  return isConnectWalletNetwork.value
}

const verifyLoginError = async () => {
  const isLogin = await verifyLogin()
  if (!isLogin) throw new Error('Please connect the wallet first')
}

export const useWeb3Wallet = () => {
  initState()
  return {
    address,
    isConnectWallet,
    networkChain,
    networkURL,
    networkURIKey,
    isConnectNetworkURI,
    isConnectWalletNetwork,
    isLoginLock,
    chainId,
    login,
    verifyLogin,
    verifyLoginError,
    switchNetworkURI
  }
}

// Utilities
import { defineStore } from 'pinia'
import AES from 'crypto-js/aes';
import CryptoJS from 'crypto-js';
import { NetworkURIKey } from '@/types/networkType';

const key = 'fa7c583e-704f-4d98-b567-c44ec0b330c4'

export const useAppStore = defineStore('app', {
  state: () => ({
    signatureCiphertext: localStorage.getItem('signature_hex') ?? '',
  }),
  getters: {
    signature: (state) => {
      if (!state.signatureCiphertext) return '';
      const temp = JSON.parse(AES.decrypt(state.signatureCiphertext, key).toString(CryptoJS.enc.Utf8))
      return temp.signature as string
    },
    signatureAddress: (state) => {
      if (!state.signatureCiphertext) return '';
      const temp = JSON.parse(AES.decrypt(state.signatureCiphertext, key).toString(CryptoJS.enc.Utf8))
      return temp.address as string
    },
    signatureNetwork: (state) => {
      if (!state.signatureCiphertext) return '';
      const temp = JSON.parse(AES.decrypt(state.signatureCiphertext, key).toString(CryptoJS.enc.Utf8))
      return temp.network as NetworkURIKey
    },
  },
  actions: {
    setSignature(address: string, signature: string, network: NetworkURIKey){
      const signatureCiphertext = AES.encrypt(JSON.stringify({address, signature, network}), key).toString()
      this.signatureCiphertext = signatureCiphertext;
      localStorage.setItem('signature_hex', signatureCiphertext)
    }
  }
})

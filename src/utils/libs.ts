import BigNumber from "bignumber.js"

export const ratioAsPercentage = (ratio: number) => {
  return BigNumber(ratio).times(100).toNumber()
}


export const ratioBigintAsPercentage = (ratio: bigint) => {
  return BigNumber(ratio.toString()).div(10000).toNumber()
}


export const ratioBigintAsNumber = (ratio: bigint) => {
  return BigNumber(ratio.toString()).div(1000000).toNumber()
}


export const ratioPercentageAsBigint = (ratio: string) => {
  const ratioTemp = ratio.replace('%', '')
  return BigInt(BigNumber(ratioTemp).times(10000).toString())
}

export const randomReferrerUID = (size: number) => {
  const strLib = `abcdefghijklmnopqrstuvwxyz1234567890`
  return Array.from({length: size}, () => strLib[Math.floor((Math.random() * strLib.length))]).join('')
}

/*
*
* isHashPath = false
* http://localhost:300/localhost => localhost
* http://localhost:300/localhost?referrer=abc => localhost
*
* isHashPath = true
* http://localhost:300/#/localhost => localhost
* http://localhost:300/#/localhost?referrer=abc => localhost
*/
export const getNetworkURIByHref = (isHashPath = false) => {
  const temp1 = isHashPath ? location.hash : location.pathname
  const temp2 = temp1.startsWith('/') ? temp1.slice(1) : temp1
  const temp3 = temp2.startsWith('#') ? temp2.replace('#/', '') : temp2
  const temp4 = (() => {
    if (temp3.includes('/')) {
      return temp3.slice(0, temp3.indexOf('/'))
    }
    if (temp3.includes('?')) {
      return temp3.slice(0, temp3.indexOf('?'))
    }
    return temp3
  })()
  const temp5 = temp4.startsWith('#') ? temp4.slice(1) : temp4
  if (temp5.includes('#')){
    return temp5.slice(0, temp5.indexOf('#'))
  }
  return temp5
}

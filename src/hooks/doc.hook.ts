import { doccnLink, docenLink } from "@/config/link.config";

const getBrowserLanguage = (): 'en' | 'cn' => {
  const browserLang : string = navigator.language
    ? navigator.language
    : (navigator as any).browserLanguage;
  if (!browserLang) return 'en'
  if (browserLang.includes('zh')) return 'cn'
  return 'en'
}

const getDefaultDocLink = () => {
  const browserLang = getBrowserLanguage()
  if (browserLang === 'cn') return doccnLink
  return docenLink
}


const getHomeReferrerDocLink = () => {
  const browserLang = getBrowserLanguage()

  const docLink = browserLang === 'cn' ? doccnLink : docenLink;
  // if (browserLang === 'cn') return `${doccnLink}/you-hu-zhi-yin/ji-ben-zhi-yin`
  return `${docLink}/game-guide/basic-guide`
}


const getInviteDocLink = () => {
  const browserLang = getBrowserLanguage()
  const docLink = browserLang === 'cn' ? doccnLink : docenLink;
  // if (browserLang === 'cn') return `${doccnLink}/you-hu-zhi-yin/invite-shui-ming`
  return `${docLink}/game-guide/invite-introduction`
}

export const useDocHook = () => ({
  getDefaultDocLink,
  getHomeReferrerDocLink,
  getInviteDocLink
})

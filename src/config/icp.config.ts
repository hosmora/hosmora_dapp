// import { VITE_ENV_NAME } from "./env.config"

const getHost = () => {
    // if (VITE_ENV_NAME === 'test_local') {
    //     return 'http://192.168.1.27:80'
    // }
    return 'https://icp-api.io'
}

const getCanisterId = () => {
    // if (VITE_ENV_NAME === 'test_local') {
    //     return 'aovwi-4maaa-aaaaa-qaagq-cai'
    // }
    // if (VITE_ENV_NAME === 'test') {
    //     return '7ulr6-faaaa-aaaab-qacwq-cai'
    // }
    return 'gr2up-bqaaa-aaaag-ach5a-cai'
}

export const host = getHost()
export const canisterId = getCanisterId()

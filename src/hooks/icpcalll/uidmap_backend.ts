import { idlFactory } from '@/assets/icpdid/uidmap_backend.did';
import type { _SERVICE } from '@/assets/icpdid/uidmap_backend.d';
import { VITE_ENV_NAME } from '@/config/env.config';
import { canisterId, host } from '@/config/icp.config';
import { randomReferrerUID } from '@/utils/libs';
import { Actor, ActorSubclass, HttpAgent } from "@dfinity/agent";
const _getActor = (() => {
  let actor: ActorSubclass<_SERVICE>;

  return async () => {
    if (actor) return actor;
    const agent = new HttpAgent({ host });
    if (VITE_ENV_NAME === "test_local") {
      await agent.fetchRootKey();
    }
    actor = Actor.createActor<_SERVICE>(idlFactory, {
      agent,
      canisterId,
    });
    return actor;
  };
})();

const getNumByUIDSize = async (size: number) => {
  const actor = await _getActor();
  const num = await actor.getNumByUIDSize(BigInt(size))
  return num;
}

const getUIDGroup = async () => {
  const actor = await _getActor();
  return await actor.getUIDGroup();
}

const isUseUID = async (uid: string) => {
  const actor = await _getActor();
  return await actor.isUseUID(uid);
}

const getUIDByInfo = async (_network: string, _address: string) => {
  const actor = await _getActor();
  const uid =  await actor.getUIDByInfo(_network, _address);
  if (uid.length <= 0) throw new Error('No uid matching for info');
  return uid
}

const register = async (_network: string, _address: string, uids: string[]) => {
  const actor = await _getActor();
  return await actor.register(_network, _address, uids);
}

const getAndInitUIDByInfo = async (_network: string, _address: string) => {
  try {
    const oldUid = await getUIDByInfo(_network, _address)
    return oldUid;
  } catch (error) { /* empty */ }
  let uid: string = '';
  for (let index = 1; index <= 3; index++) {
    try {
      uid = await register(_network, _address, Array.from({length: 20}, () => randomReferrerUID(6)))
      break;
    } catch (error) {
      if (index === 3) {
        throw error;
      }
      console.error(error)
    }
  }
  if (uid.length <= 0) throw new Error('uid initialization failed')
  return uid;
}

export const useICPUIDMap = () => ({
  getUIDByInfo,
  getAndInitUIDByInfo,
})

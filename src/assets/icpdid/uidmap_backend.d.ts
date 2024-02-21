import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface UIDGroup { 'uidTextSize' : bigint, 'totalNum' : bigint }
export interface UIDInfo {
  'uid' : string,
  'network' : string,
  'address' : string,
}
export interface UIDNetworkGroup {
  'network' : string,
  'group' : Array<UIDGroup>,
}
export interface _SERVICE {
  'getInfoByUid' : ActorMethod<[string], [] | [UIDInfo]>,
  'getNumByUIDSize' : ActorMethod<[bigint], bigint>,
  'getNumUIDNetwork' : ActorMethod<[string, bigint], bigint>,
  'getUIDByInfo' : ActorMethod<[string, string], string>,
  'getUIDGroup' : ActorMethod<[], Array<UIDGroup>>,
  'getUIDNetworkGroup' : ActorMethod<[], Array<UIDNetworkGroup>>,
  'isUseUID' : ActorMethod<[string], boolean>,
  'register' : ActorMethod<[string, string, Array<string>], string>,
}

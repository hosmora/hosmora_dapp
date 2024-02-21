import { IDL } from '@dfinity/candid'

export const idlFactory: IDL.InterfaceFactory = ({ IDL }) => {
  const UIDInfo = IDL.Record({
    uid: IDL.Text,
    network: IDL.Text,
    address: IDL.Text
  })
  const UIDGroup = IDL.Record({
    uidTextSize: IDL.Nat,
    totalNum: IDL.Nat
  })
  const UIDNetworkGroup = IDL.Record({
    network: IDL.Text,
    group: IDL.Vec(UIDGroup)
  })
  return IDL.Service({
    getInfoByUid: IDL.Func([IDL.Text], [IDL.Opt(UIDInfo)], ['query']),
    getNumByUIDSize: IDL.Func([IDL.Nat], [IDL.Nat], ['query']),
    getNumUIDNetwork: IDL.Func([IDL.Text, IDL.Nat], [IDL.Nat], ['query']),
    getUIDByInfo: IDL.Func([IDL.Text, IDL.Text], [IDL.Text], ['query']),
    getUIDGroup: IDL.Func([], [IDL.Vec(UIDGroup)], ['query']),
    getUIDNetworkGroup: IDL.Func([], [IDL.Vec(UIDNetworkGroup)], ['query']),
    isUseUID: IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    register: IDL.Func([IDL.Text, IDL.Text, IDL.Vec(IDL.Text)], [IDL.Text], [])
  })
}
// eslint-disable-next-line no-empty-pattern
export const init = ({}) => {
  return []
}

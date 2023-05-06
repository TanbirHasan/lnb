import { atom } from "recoil";
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist({key:'receiversEmailRecoil'})

export const emailListRecoil = atom({
  key: "emailListRecoil",
  default: [],
  effects_UNSTABLE: [persistAtom]

});

import { atom } from "recoil";
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist({key:'companyListRecoil'})

//stores list of selected companies ...
export const companyListRecoilState = atom({
  key: "companyListRecoil",
  default: [],
  effects_UNSTABLE: [persistAtom]
});

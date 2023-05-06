import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist({key:'serviceResquestResponseRecoil'})


export const serviceResquestResponseRecoilState = atom({
  key: "serviceResquestResponseRecoil",
  default: {},
  effects_UNSTABLE: [persistAtom]
});

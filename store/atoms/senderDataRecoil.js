import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({key:'senderDataRecoil'})


export const senderDataRecoil = atom({
    key: 'senderDataRecoil', 
    default: {},
    effects_UNSTABLE: [persistAtom]
  });
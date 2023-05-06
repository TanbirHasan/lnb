import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist({key:'companySearchDataRecoil'})

export const companySearchDataRecoil = atom({
    key: "companySearchDataRecoil",
    default: [],
    effects_UNSTABLE: [persistAtom]

})
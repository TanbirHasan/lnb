import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

// const { persistAtom } = recoilPersist({key:'paginationRecoil'})


export const priceRecoil = atom({
  key: "priceRecoil",
  default: {
    MAIL_PRINT_SERVICE: "10",
    DOWNLOAD_SERVICE: "3",
    EMAIL_SERVICE : "5"
  },
  // effects_UNSTABLE: [persistAtom]
});
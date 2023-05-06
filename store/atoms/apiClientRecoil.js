import { atom } from "recoil";

//company-search data caching
export const apiClientRecoil = atom({
  key: "apiClientRecoil",
  default: {},
});

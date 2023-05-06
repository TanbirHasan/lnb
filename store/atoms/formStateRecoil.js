import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { companyListRecoilState } from "./companyListRecoil";

const { persistAtom } = recoilPersist({ key: "formStateRecoil" });

export const formStateRecoil = atom({
  key: "formStateRecoil",
  default: {
    step_two: companyListRecoilState,
    step_three: "",
    step_four: {},
    emailSubject: "",
    emailTemplate : "",
    letterKey: null,
  },
  effects_UNSTABLE: [persistAtom],
});

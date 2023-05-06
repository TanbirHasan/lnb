import { atom, selector } from "recoil";
import { recoilPersist } from "recoil-persist";

// const { persistAtom } = recoilPersist({key:'paginationRecoil'})


export const paginationRecoil = atom({
  key: "paginationRecoil",
  default: {
    company_name: "",
    postal_code: "",
    sic_codes: "",
    incorporated_from: "",
    incorporated_to: "",
    limit: "",
    city: "",
    sort_by: "",
    page: 1,
    total: 0,
    noTotalPage: 0,
  },
  // effects_UNSTABLE: [persistAtom]
});

// export const updatePagination = selector({ß
//   key: 'updatePaginationRecoil',
//   get: (data) => {
//   },
//   set: ( { get, set} ) => {
//     set()
//   }
// })
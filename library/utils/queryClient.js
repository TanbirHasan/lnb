import apiClient from "../apis/api-client";
import Cookies from "js-cookie";
import apiRefreshToken from "../apis/api-refreshToken";


// export const fileUploadConfig = {
//     headers: { 'content-type': 'form-data' },
//     onUploadProgress: (event) => {
//       console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
//     },
// };

function paginationQueryBuilder(state) {
  let query = "";
  Object.keys(state).forEach((key, index) => {
    if (state[key] && String(state[key].length)) {
      if(key+"" === "total" || key+"" === "noTotalPage"){}
      else{
        if (query.length === 0) {
          query += key + "=" + String(state[key]);
        } else {
          query += "&" + key + "=" + String(state[key]);
        }
      }
    }
  });
  return query;
}

export async function paginationClient(state) {
  const query = paginationQueryBuilder(state);
  const response = await apiClient.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/company/companySearch?${query}`
  );
  return response.data;
}

export async function userInfoClient() {
  const response = await apiClient.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/self/profile`
  );
  return response.data;
}

export async function fileUploadClient(id, file) {
  const response = await apiClient.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/logo-upload?${id}`,
    file
  );
  return response.data;
}

export async function serviceRequestClient(payload) {
  const response = await apiClient.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/history/service-request`,
    payload
  );
  return response.data;
}

export async function freeServiceRequestClient(payload) {
  const response = await apiClient.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/history/free-service-request`,
    payload
  );
  return response.data;
}

export async function checkoutRequestClient(payload) {
  const response = await apiClient.post(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/history/checkout`,
    payload
  );
  return response.data;
}

export async function refreshToken() {
  try{
    const response = await apiRefreshToken.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh-token`
    );
    return (response.data.status === 200) ? response.data :  null
  }catch(e){
    return null
  }
}


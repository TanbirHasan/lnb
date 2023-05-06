import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import Cookies from "js-cookie";

const apiRefreshToken = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const onRequest = async (config) => {
  return new Promise(async (resolve) => {
    const token = Cookies.get("refreshToken");
    if(token && config.headers !== undefined) {
      config.headers["x-refresh-token"] = `${token}`;
    }
    resolve(config);
  });
};

apiRefreshToken.interceptors.request.use(onRequest);

export default apiRefreshToken;

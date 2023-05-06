import axios from "axios";
import Cookies from "js-cookie";
import { refreshToken } from "../utils/queryClient";
import { isTokenExpired } from "../utils/tokenExpiryChecker";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

const onRequest = async (config) => {
  return new Promise(async (resolve) => {
    const token = Cookies.get("token");
    if (token && config.headers !== undefined) {
      if (isTokenExpired(token)) {
        try {
          const data = await refreshToken();
          if (!data) {
            // Cookies.remove("token");
            // Cookies.remove("refreshToken");
          } else {
            token = data["accessToken"];
            Cookies.set("token", data["accessToken"]);
            Cookies.set("refreshToken", data["refreshToken"]);
          }
        } catch (e) {}
      }
      config.headers["x-access-token"] = `${token}`;
    }
    resolve(config);
  });
};
const onErr = (error) => {
  return Promise.reject(error);
};

apiClient.interceptors.request.use(onRequest);

apiClient.interceptors.response.use(
  (res) => {
    return res;
  },
  async (err) => {
    const originalConfig = err.config;
    if (err.response) {
      // Access Token was expired
      if (err.response.status === 401 || err.response.status === 403) {
        originalConfig._retry = true;
        // && !originalConfig._retry

        try {
          const rs = await refreshToken();
          if (rs) {
            // const { accessToken, refreshToken } = rs.data;
            // window.localStorage.setItem("accessToken", accessToken);
            Cookies.set("token", rs.accessToken);
            Cookies.set("refreshToken", rs.refreshToken);

            apiClient.defaults.headers.common["x-access-token"] =
              rs.accessToken;

            return apiClient(originalConfig);
          }
        } catch (_error) {
          if (_error.response && _error.response.data) {
            return Promise.reject(_error.response.data);
          }
          return Promise.reject(_error);
        }
      } else if (err.response.data) {
        return Promise.reject(err.response.data);
      }
    }

    return Promise.reject(err);
  }
);

export default apiClient;

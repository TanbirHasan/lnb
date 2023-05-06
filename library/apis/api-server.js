import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

const apiServer = (token)=>{

    return  axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        timeout: 1000000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-access-token": token
        },
      })
};


export default apiServer;

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import * as cookie from 'cookie'

const apiServerRT = (cookies)=>{

    let parsedCookies = cookie.parse(cookies)

    return  axios.create({
        baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
        timeout: 1000000,
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "x-refresh-token": parsedCookies['refreshToken']
        },
      })

};


export default apiServerRT;

import React, {useEffect} from "react";
import CompnayListSender from "../../components/Search/CompanyListSender/CompnayListSender";
import Home from "../home";
import apiServer from "../../library/apis/api-server";
import {isTokenExpired} from "../../library/utils/tokenExpiryChecker";
import apiServerRT from "../../library/apis/api-server-refresh-token";
import * as cookie from 'cookie'
import Cookies from "js-cookie";


const Companylistsender = ({data}) => {

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  },[]);

  useEffect(()=>{
    if(data.token && data.refreshToken){
        Cookies.set('token', data.token);
        Cookies.set('refreshToken',  data.refreshToken);
    }
  },[data])

  


  return (
    <Home>
      <div>
        <CompnayListSender props={data.data} />
      </div>
    </Home>
  );
};

export async function getServerSideProps(context) {
  let cookies = await context.req.headers.cookie
  let token = cookie.parse(cookies)['token']
  let tokensData = null 



  if(isTokenExpired(token)){
    // try{
      tokensData = await apiServerRT(cookies).get(`/auth/refresh-token`);
      if(tokensData.data.status === 200){
        // context.res.setHeader('set-cookie', [
        //   // `token=${tokensData.data.accessToken}`, 
        //   // `refreshToken=${tokensData.data.refreshToken}`,
        //       cookie.serialize(
        //         'token', tokensData.data.accessToken, {
        //             httpOnly: true,
        //             // secure: process.env.NODE_ENV !== 'development',
        //             // maxAge: 60 * 30,
        //             // sameSite: 'strict',
        //             path: '/'
        //         }
        //       ),
        //       cookie.serialize(
        //           'refreshToken', tokensData.data.refreshToken, {
        //               httpOnly: true,
        //               // secure: process.env.NODE_ENV !== 'development',
        //               // maxAge: 60 * 60 * 24,
        //               // sameSite: 'strict',
        //               path: '/'
        //           }
        //       )
        // ])
        token = tokensData.data.accessToken
      }
      // else{   
    //     tokensData = null
    //     token = null
    //   }
     
    // }catch(e){
    //   tokensData = null
    //   token = null
    // }
    
  }


  const response = await apiServer(token).get(`/users/self/profile`);

  if(response.data.status === 200){
    return {
      props: {
        data: {
          data: response.data.data,
          token: tokensData?.data?.accessToken ?? null,
          refreshToken: tokensData?.data?.refreshToken ?? null  
        }
      },
    }
  }else{
    return {
      redirect: {
      permanent: false,
      destination: "auth/login",
      },
      props:{}, 
    }
  }

  // if (typeof cookies !== 'string') {
  //   return {
  //     redirect: {
  //     permanent: false,
  //     destination: "auth/login",
  //     },
  //     props:{}, 
  //   }
  // }   else 
  // return {
  //   props: {},
  // }
  // else {
  //     return {
  //         props: { auth: true },
  //     }
  // }
}

export default Companylistsender;

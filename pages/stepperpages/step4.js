import React, { Suspense, useEffect } from "react";
const PaymentOption = React.lazy(() => import('../../components/Search/PaymentOption/PaymentOption'));
const Home = React.lazy(() => import('../home'));
import { priceRecoil } from "../../store/atoms/priceRecoil";
import { useRecoilState } from "recoil";
import apiServer from "../../library/apis/api-server";
import * as cookie from "cookie";
import { isTokenExpired } from "../../library/utils/tokenExpiryChecker";
import apiServerRT from "../../library/apis/api-server-refresh-token";
import Cookies from "js-cookie";
import Fallback  from "../loading";

const Payment = (props) => {
  const [price, setPrice] = useRecoilState(priceRecoil);

  useEffect(() => {
    // window.scrollTo({ top: 800, behavior: "instant" });

    if (props.data.token && props.data.refreshToken) {
      Cookies.set("token", props.data.token);
      Cookies.set("refreshToken", props.data.refreshToken);
    }

    setPrice(props.data.data);
  }, [props]);

  return (
    <Suspense fallback={<Fallback />}>
      <Home>
        <div>
          <PaymentOption props={props.data.key} />
        </div>
      </Home>
    </Suspense>
  );
};

export async function getServerSideProps(context) {
  let cookies = await context.req.headers.cookie;
  let token = cookie.parse(cookies)["token"];
  let tokensData = null;

  if (isTokenExpired(token)) {
    // try{
    tokensData = await apiServerRT(cookies).get(`/auth/refresh-token`);
    if (tokensData.data.status === 200) {
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
      token = tokensData.data.accessToken;
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

  const response = await apiServer(token).get(`/settings/retrievePrices`);
  const response2 = await apiServer(token).get(
    `/settings/retrievePublicStripeKeys`
  );

  if (response.data.status === 200 && response2.data.status === 200) {
    return {
      props: {
        data: {
          data: response.data.prices,
          key: response2.data.stripe_pk,
          token: tokensData?.data?.accessToken ?? null,
          refreshToken: tokensData?.data?.refreshToken ?? null,
        },
      },
    };
  } else {
    return {
      redirect: {
        permanent: false,
        destination: "auth/login",
      },
      props: {},
    };
  }
}

export default Payment;

import React from "react";
import Head from "next/head";
import "../styles/globals.scss";
import {RecoilRoot} from "recoil";
import {SnackbarProvider} from "notistack";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Local New Business</title>
      </Head>
      <SnackbarProvider
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        autoHideDuration={2000}
      >
        <RecoilRoot>
          {/* <RouteGuard> */}
          <Component {...pageProps} />

          {/* </RouteGuard> */}
        </RecoilRoot>
      </SnackbarProvider>
    </>
  );
}

export default MyApp;

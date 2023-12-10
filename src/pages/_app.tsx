import { type AppType } from "next/app";
import Head from "next/head";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { AuthContextProvider } from "~/context/AuthContext";
import UserContent from "~/components/UserContent";
import { ChakraProvider } from "@chakra-ui/react";
import theme from "theme";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <AuthContextProvider>
      <Head>
        <title>Goober</title>
        <meta
          name="description"
          content="Goober is a ride-share taxi service web application designed to connect riders with available drivers."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ChakraProvider theme={theme}>
        <UserContent>
          <Component {...pageProps} />
        </UserContent>
      </ChakraProvider>
    </AuthContextProvider>
  );
};

export default api.withTRPC(MyApp);

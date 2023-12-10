import { type AppType } from "next/app";
import Head from "next/head";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { AuthContextProvider } from "~/context/AuthContext";
import UserContent from "~/components/UserContent";

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

      <UserContent>
        <Component {...pageProps} />
      </UserContent>
    </AuthContextProvider>
  );
};

export default api.withTRPC(MyApp);

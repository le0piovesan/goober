import { type AppType } from "next/app";
import Head from "next/head";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import SideBar from "~/components/SideBar";
import { AuthContextProvider } from "~/context/AuthContext";
import useAuthRedirect from "~/hooks/useAuthRedirect";

const MyApp: AppType = ({ Component, pageProps }) => {
  const { isLoggedIn } = useAuthRedirect();

  console.log("number of renders");
  console.log(isLoggedIn);

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

      <div className="container mx-auto flex items-start">
        {isLoggedIn && <SideBar />}
        <div className="min-h-screen flex-grow border-x">
          <Component {...pageProps} />
        </div>
      </div>
    </AuthContextProvider>
  );
};

export default api.withTRPC(MyApp);

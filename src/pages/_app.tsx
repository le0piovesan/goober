import { type AppType } from "next/app";
import Head from "next/head";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import { AuthContextProvider } from "~/context/AuthContext";
import UserContent from "~/components/UserContent";
import { ChakraProvider, Flex } from "@chakra-ui/react";
import theme from "theme";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <QueryClientProvider client={queryClient}>
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
          <Flex
            bgImage="url('/goober-gradient-titled-bg.png')"
            bgRepeat="no-repeat"
            bgSize="contain"
            bgColor={"gray.200"}
            bgPosition="right bottom"
          >
            <UserContent>
              <Component {...pageProps} />
            </UserContent>
          </Flex>
        </ChakraProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  );
};

export default api.withTRPC(MyApp);

import { type NextPage } from "next";
import Layout from "~/components/Layout";
import { Heading } from "@chakra-ui/react";

const NotificationList: NextPage = () => {
  return (
    <Layout>
      <Heading>List of notifications</Heading>
    </Layout>
  );
};

export default NotificationList;

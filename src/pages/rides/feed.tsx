import { Spinner } from "@chakra-ui/react";
import { type NextPage } from "next";
import ContainerCard from "~/components/ContainerCard";
import useUserRides from "~/hooks/useUserRides";

const Feed: NextPage = () => {
  const { rides, isLoading } = useUserRides();

  console.log("testing render");
  console.log(rides);

  if (isLoading) return <Spinner />;
  return <ContainerCard />;
};

export default Feed;

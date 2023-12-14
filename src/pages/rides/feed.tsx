import { type NextPage } from "next";
import RidesContainer from "~/components/RidesContainer";
import useCurrentPosition from "~/hooks/useCurrentPosition";
import { useAuth } from "~/context/AuthContext";
import { Text, VStack } from "@chakra-ui/react";

const Feed: NextPage = () => {
  const { user } = useAuth();
  user && user.type === "Driver" ? useCurrentPosition() : { position: null };

  return (
    <VStack width="100%" mx={2}>
      <Text fontSize="2xl" fontWeight="bold" color={"primary"} m={1}>
        {user && user.type === "Driver" ? "Rides Feed" : "My Rides"}
      </Text>
      <RidesContainer />
    </VStack>
  );
};

export default Feed;

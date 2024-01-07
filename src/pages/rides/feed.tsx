import { type NextPage } from "next";
import RidesContainer from "~/components/RidesContainer";
import useCurrentPosition from "~/hooks/useCurrentPosition";
import { useAuth } from "~/context/AuthContext";
import { Text, VStack } from "@chakra-ui/react";
import { api } from "~/utils/api";
import Training from "~/components/onboarding/Training";

const Feed: NextPage = () => {
  const { user } = useAuth();
  const isDriver = user && user.type === "Driver";
  isDriver ? useCurrentPosition() : { position: null };
  let tutorialCompleted;
  if (isDriver) {
    const { data } = api.driver.checkDriverTutorialStatus.useQuery({
      id: user.id,
    });
    tutorialCompleted = data?.tutorialCompleted;
  }

  return (
    <VStack width="100%" mx={2}>
      {isDriver && !tutorialCompleted ? (
        <Training />
      ) : (
        <>
          <Text fontSize="xl" fontWeight="bold" color={"secondary"} m={1}>
            {isDriver
              ? "Hello Driver, how are you feeling today?"
              : "Hello Rider, where are you going today?"}
          </Text>
          <Text fontSize="2xl" fontWeight="bold" color={"primary"} m={1}>
            My Rides
          </Text>
          <RidesContainer />
        </>
      )}
    </VStack>
  );
};

export default Feed;

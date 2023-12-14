import { Flex } from "@chakra-ui/react";
import RideCard from "./RideCard";
import useUserRides from "~/hooks/useUserRides";
import { useAuth } from "~/context/AuthContext";
import Loading from "./Loading";
import EmptyState from "./EmptyState";

const RidesContainer = () => {
  const { rides, isLoading } = useUserRides();
  const { user } = useAuth();

  if (isLoading) return <Loading />;

  if (rides && rides.length > 0)
    return (
      <Flex direction="column" m={4}>
        {rides
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
          .map((ride) => (
            <RideCard key={ride.id} ride={ride} />
          ))}
      </Flex>
    );
  else
    return (
      <EmptyState
        title="No goober rides yet."
        subtext={
          user && user.type === "Rider"
            ? "Go somewhere fun by accessing the menu on the left and call your first Goober driver"
            : "No worries, soon someone will request a ride!"
        }
      />
    );
};

export default RidesContainer;

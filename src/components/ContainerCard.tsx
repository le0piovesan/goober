import { Flex, Grid } from "@chakra-ui/react";
import CardComponent from "./CardComponent";
import useUserRides from "~/hooks/useUserRides";
import { useAuth } from "~/context/AuthContext";
import Loading from "./Loading";
import EmptyState from "./EmptyState";

const ContainerCard = () => {
  const { rides, isLoading } = useUserRides();
  const { user } = useAuth();

  if (isLoading) return <Loading />;

  if (rides && rides.length > 0)
    return (
      <Flex direction="column">
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
          {rides.map((ride) => (
            <CardComponent key={ride.id} ride={ride} />
          ))}
        </Grid>
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

export default ContainerCard;

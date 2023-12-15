import { Flex } from "@chakra-ui/react";
import RideCard from "./RideCard";
import useUserRides from "~/hooks/useUserRides";
import { useAuth } from "~/context/AuthContext";
import EmptyState from "./EmptyState";
import RideCardSkeleton from "./skeletons/RideCardSkeleton";
import { useState } from "react";
import InputComponent from "./InputComponent";
import ActiveCard from "./BouncingActiveCard";

const RidesContainer = () => {
  const { rides, isLoading } = useUserRides();
  const { user } = useAuth();
  const [search, setSearch] = useState("");

  const filteredRides = rides
    ? rides.filter(
        (ride) =>
          ride.originName.toLowerCase().includes(search.toLowerCase()) ||
          ride.destinationName.toLowerCase().includes(search.toLowerCase()),
      )
    : [];

  return (
    <Flex direction="column" m={4}>
      {filteredRides && filteredRides.length > 0 && (
        <InputComponent
          placeholder="Search here for rides"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      )}

      {isLoading ? (
        <>
          <RideCardSkeleton />
          <RideCardSkeleton />
          <RideCardSkeleton />
        </>
      ) : filteredRides && filteredRides.length > 0 ? (
        filteredRides
          .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
          .map((ride) =>
            ride.status.current === "ONGOING" ? (
              <ActiveCard>
                <RideCard key={ride.id} ride={ride} />
              </ActiveCard>
            ) : (
              <RideCard key={ride.id} ride={ride} />
            ),
          )
      ) : (
        <EmptyState
          title="No goober rides yet."
          subtext={
            user && user.type === "Rider"
              ? "Go somewhere fun by accessing the menu on the left and call your first Goober driver"
              : "No worries, soon someone will request a ride!"
          }
        />
      )}
    </Flex>
  );
};

export default RidesContainer;

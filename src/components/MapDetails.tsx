import { Box, Heading, Text, HStack } from "@chakra-ui/react";
import ButtonComponent from "./ButtonComponent";
import MapDriversCard from "./MapDriversCard";

type DriverTypes = {
  id: number;
  type: string;
};

type MapDetailsProps = {
  distanceDetails: { value: number; distance: string };
  setDistanceDetails: React.Dispatch<
    React.SetStateAction<{
      value: number;
      distance: string;
    }>
  >;
  loading: boolean;
  pickupLocationRef: React.MutableRefObject<google.maps.LatLngLiteral | null>;
  availableDrivers: DriverTypes[];
  setAvailableDrivers: React.Dispatch<React.SetStateAction<DriverTypes[]>>;
  onSubmit: (
    rideType: "Regular" | "Luxury",
    tripValue: number,
  ) => Promise<void>;
};

const MapDetails: React.FC<MapDetailsProps> = ({
  distanceDetails,
  setDistanceDetails,
  availableDrivers,
  setAvailableDrivers,
  onSubmit,
  loading,
}) => {
  return (
    <>
      <Heading size="sm" color={"primary"}>
        Goober Driver Availables:
      </Heading>
      <Box textAlign="left">
        <HStack>
          <Heading size="sm" fontWeight={""}>
            Distance:
          </Heading>
          <Text fontSize="md" fontWeight={"bold"} color={"primary"}>
            {distanceDetails.distance}
          </Text>
        </HStack>

        <Text fontSize={"xs"} mb={2}>
          Available:
        </Text>
        {availableDrivers && availableDrivers.length > 0 ? (
          <>
            <MapDriversCard
              type="Regular"
              drivers={availableDrivers}
              distanceValue={distanceDetails.value}
              onSubmit={onSubmit}
              loading={loading}
            />
            <MapDriversCard
              type="Luxury"
              drivers={availableDrivers}
              distanceValue={distanceDetails.value}
              onSubmit={onSubmit}
              loading={loading}
            />
          </>
        ) : (
          <Text fontSize={"xs"} mb={2}>
            No drivers available, try again later
          </Text>
        )}
      </Box>

      <ButtonComponent
        textOnly
        onClick={() => {
          setDistanceDetails({
            value: 0,
            distance: "",
          });
          setAvailableDrivers([]);
        }}
      >
        Go Back
      </ButtonComponent>
    </>
  );
};

export default MapDetails;

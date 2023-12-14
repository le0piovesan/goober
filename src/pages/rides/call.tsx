import { type NextPage } from "next";
import Map from "~/components/Map";
import { useJsApiLoader, type Libraries } from "@react-google-maps/api";
import { useRef } from "react";
import { Text, VStack, Flex, Box } from "@chakra-ui/react";
import MapSkeleton from "~/components/skeletons/MapSkeleton";

const Call: NextPage = () => {
  const libraries = useRef<Libraries>(["places"]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: libraries.current,
  });

  if (!isLoaded) return <MapSkeleton />;

  return (
    <VStack width="100%" mx={2}>
      <Text fontSize="2xl" fontWeight="bold" color={"primary"} m={1}>
        Get a Ride
      </Text>
      <Flex width="100%" height="100%">
        <Box width="100%" height="100%">
          <Map />
        </Box>
      </Flex>
    </VStack>
  );
};

export default Call;

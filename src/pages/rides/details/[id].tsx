import { GoogleMap } from "@react-google-maps/api";
import { useLoadScript, type Libraries } from "@react-google-maps/api";
import { useRouter } from "next/router";
import { Box, Card, CardBody, Flex } from "@chakra-ui/react";
import MapMarkerDirections from "~/components/MapMarkerDirections";
import { useRef, useState, useEffect } from "react";
import MapSkeleton from "~/components/skeletons/MapSkeleton";

type Coordinates = {
  lat: number;
  lng: number;
};

type MapViewProps = {
  pickupLocation: Coordinates;
  dropoffLocation: Coordinates;
  directions: google.maps.DirectionsResult | null;
};

const MapView: React.FC<MapViewProps> = () => {
  const router = useRouter();
  const { pickupLat, pickupLng, dropoffLat, dropoffLng } = router.query;
  const pickupLocationRef = useRef({
    lat: Number(pickupLat),
    lng: Number(pickupLng),
  });
  const dropoffLocationRef = useRef({
    lat: Number(dropoffLat),
    lng: Number(dropoffLng),
  });
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const typedSetDirections: React.Dispatch<
    React.SetStateAction<google.maps.DirectionsResult | null>
  > = setDirections;

  const libraries = useRef<Libraries>(["places"]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: libraries.current,
  });

  useEffect(() => {
    if (isLoaded) {
      const fetchDirections = async () => {
        const directionService = new google.maps.DirectionsService();

        const directionsResult = await directionService.route({
          origin: pickupLocationRef.current,
          destination: dropoffLocationRef.current,
          travelMode: google.maps.TravelMode.DRIVING,
        });
        typedSetDirections(directionsResult);
      };

      void fetchDirections();
    }
  }, [isLoaded]);

  if (!isLoaded) return <MapSkeleton />;

  return (
    <Flex width="100%" height="100%">
      <Box width="100%" height="100%" p={4}>
        <Card bgColor={"light"} boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}>
          <CardBody>
            <GoogleMap
              zoom={15}
              mapContainerStyle={{ width: "100%", height: "70vh" }}
              center={{
                lat: pickupLocationRef.current.lat,
                lng: pickupLocationRef.current.lng,
              }}
              options={{
                streetViewControl: false,
                mapTypeControlOptions: {
                  mapTypeIds: [google.maps.MapTypeId.ROADMAP],
                },
                fullscreenControl: false,
              }}
            >
              {pickupLocationRef.current &&
                dropoffLocationRef.current &&
                directions && (
                  <MapMarkerDirections
                    pickupLocationRef={pickupLocationRef}
                    dropoffLocationRef={dropoffLocationRef}
                    directions={directions}
                  />
                )}
            </GoogleMap>
          </CardBody>
        </Card>
      </Box>
    </Flex>
  );
};

export default MapView;

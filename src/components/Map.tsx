import { GoogleMap } from "@react-google-maps/api";
import { Card, CardBody, VStack, useToast } from "@chakra-ui/react";
import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { useForm } from "react-hook-form";
import { useLoading } from "~/hooks/useLoading";
import useCurrentPosition from "~/hooks/useCurrentPosition";
import { useRef, useState } from "react";
import useRetrieveRouteInfo from "~/hooks/useRetrieveRouteInfo";
import MapDetails from "./MapDetails";
import MapSearch from "./MapSearch";
import MapMarkerDirections from "./MapMarkerDirections";
import { useRouter } from "next/router";
import { schema } from "~/utils/schemas/map";

type Coordinates = {
  lat: number;
  lng: number;
};

type FormInputsProps = z.infer<typeof schema>;

const Map: React.FC = () => {
  const { user } = useAuth();
  const { position } = useCurrentPosition();
  const ride = api.ride.createRide.useMutation();
  const toast = useToast();
  const { loading, startLoading, stopLoading } = useLoading();
  const pickupLocationRef = useRef<Coordinates | null>(null);
  const dropoffLocationRef = useRef<Coordinates | null>(null);
  const [distanceDetails, setDistanceDetails] = useState({
    value: 0,
    distance: "",
  });
  const [directions, setDirections] =
    useState<google.maps.DirectionsResult | null>(null);
  const typedSetDirections: React.Dispatch<
    React.SetStateAction<google.maps.DirectionsResult | null>
  > = setDirections;

  const { retrieveRouteInfo, availableDrivers, isFetching } =
    useRetrieveRouteInfo({
      pickupLocationRef,
      dropoffLocationRef,
      setDirections: typedSetDirections,
      setDistanceDetails,
      startLoading,
      stopLoading,
    });

  const router = useRouter();

  const {
    register,
    getValues,
    formState: { errors },
  } = useForm<FormInputsProps>({
    resolver: zodResolver(schema),
    defaultValues: {
      pickupLocation: "",
      dropoffLocation: "",
    },
  });

  const onSubmit = async (
    rideType: "Regular" | "Luxury" = "Regular",
    tripValue: number,
  ) => {
    if (
      !pickupLocationRef.current ||
      !dropoffLocationRef.current ||
      !user?.id
    ) {
      toast({
        title: "Error",
        description: "No Location or User ID",
        status: "error",
        position: "top",
        duration: 4000,
        isClosable: true,
      });
      return;
    }
    const { pickupLocation, dropoffLocation } = getValues();

    try {
      startLoading();
      await ride.mutateAsync({
        tripFee: tripValue,
        distance: distanceDetails.distance,
        originName: pickupLocation,
        destinationName: dropoffLocation,
        type: rideType,
        pickupLocation: {
          latitude: pickupLocationRef.current.lat,
          longitude: pickupLocationRef.current.lng,
        },
        dropoffLocation: {
          latitude: dropoffLocationRef.current.lat,
          longitude: dropoffLocationRef.current.lng,
        },
        riderId: user.id,
      });

      toast({
        title: "Done! 🚗",
        description: "We are looking for the nearest Goober Driver!",
        status: "success",
        position: "top",
        duration: 8000,
        isClosable: true,
      });
      await router.replace("/rides/feed");
    } catch (error) {
      if (error instanceof Error)
        toast({
          title: "Error",
          description: `${error.message} 😢`,
          status: "error",
          position: "top",
          duration: 4000,
          isClosable: true,
        });
      setDistanceDetails({
        value: 0,
        distance: "",
      });
    } finally {
      stopLoading();
    }
  };

  return (
    <Card bgColor={"light"} boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}>
      <CardBody>
        <GoogleMap
          zoom={15}
          mapContainerStyle={{ width: "100%", height: "70vh" }}
          center={{
            lat: position.latitude,
            lng: position.longitude,
          }}
          options={{
            streetViewControl: false,
            mapTypeControlOptions: {
              mapTypeIds: [google.maps.MapTypeId.ROADMAP],
            },
            fullscreenControl: false,
          }}
        >
          {pickupLocationRef.current && dropoffLocationRef.current && (
            <MapMarkerDirections
              pickupLocationRef={pickupLocationRef}
              dropoffLocationRef={dropoffLocationRef}
              directions={directions}
            />
          )}
          <Card
            bgColor={"light"}
            position="absolute"
            bottom="5%"
            left="5%"
            boxShadow="0px 4px 20px rgba(0, 0, 0, 0.5)"
            borderRadius="10px"
          >
            <CardBody>
              <VStack spacing={4} w="full" maxW="md">
                {!distanceDetails.distance ||
                !directions ||
                !availableDrivers ? (
                  <MapSearch
                    register={register}
                    loading={loading}
                    retrieveRouteInfo={retrieveRouteInfo}
                    pickupLocationRef={pickupLocationRef}
                    dropoffLocationRef={dropoffLocationRef}
                    errors={errors}
                  />
                ) : (
                  <MapDetails
                    distanceDetails={distanceDetails}
                    setDistanceDetails={setDistanceDetails}
                    pickupLocationRef={pickupLocationRef}
                    availableDrivers={availableDrivers}
                    isFetching={isFetching}
                    onSubmit={onSubmit}
                    loading={loading}
                  />
                )}
              </VStack>
            </CardBody>
          </Card>
        </GoogleMap>
      </CardBody>
    </Card>
  );
};

export default Map;

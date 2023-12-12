import { GoogleMap } from "@react-google-maps/api";
import { Card, CardBody, VStack, useToast } from "@chakra-ui/react";
import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useLoading } from "~/hooks/useLoading";
import useCurrentPosition from "~/hooks/useCurrentPosition";
import { useRef, useState } from "react";
import useCalculateTripValue from "~/hooks/useCalculateTripValue";
import useRetrieveRouteInfo from "~/hooks/useRetrieveRouteInfo";
import MapDetails from "./MapDetails";
import MapSearch from "./MapSearch";
import MapMarkerDirections from "./MapMarkerDirections";
import { useRouter } from "next/router";

const schema = z.object({
  pickupLocation: z.string(),
  dropoffLocation: z.string(),
});

type Coordinates = {
  lat: number;
  lng: number;
};

type FormInputsProps = z.infer<typeof schema>;

const Map: React.FC = () => {
  console.log("Map Component Mounted");
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

  const tripValue = useCalculateTripValue(distanceDetails.value);
  const retrieveRouteInfo = useRetrieveRouteInfo(
    pickupLocationRef,
    dropoffLocationRef,
    typedSetDirections,
    setDistanceDetails,
  );
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputsProps>({
    resolver: zodResolver(schema),
    defaultValues: {
      pickupLocation: "",
      dropoffLocation: "",
    },
  });

  const onSubmit: SubmitHandler<FormInputsProps> = async (data) => {
    console.log(data);

    if (
      !pickupLocationRef.current ||
      !dropoffLocationRef.current ||
      !user?.id
    ) {
      toast({
        title: "Error",
        description: "No Location or User ID",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    try {
      startLoading();
      const response = await ride.mutateAsync({
        tripFee: tripValue,
        distance: distanceDetails.distance,
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
      console.log(response);
      toast({
        title: `${response} 🎉`,
        description: "We will notify you when a driver accepts your request.",
        status: "success",
        duration: 8000,
        isClosable: true,
      });
      await router.push("/rides/feed");
    } catch (error) {
      console.error(error);
      if (error instanceof Error)
        toast({
          title: "Error",
          description: `${error.message} 😢`,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
    } finally {
      stopLoading();
    }
  };

  return (
    <GoogleMap
      zoom={15}
      mapContainerStyle={{ width: "100%", height: "80vh" }}
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
          <VStack
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            spacing={4}
            w="full"
            maxW="md"
          >
            {!distanceDetails.distance || (!tripValue && !directions) ? (
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
                distanceDetails={distanceDetails.distance}
                setDistanceDetails={setDistanceDetails}
                tripValue={tripValue}
                loading={loading}
              />
            )}
          </VStack>
        </CardBody>
      </Card>
    </GoogleMap>
  );
};

export default Map;

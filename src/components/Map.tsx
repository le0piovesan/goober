import { GoogleMap, Marker, DirectionsRenderer } from "@react-google-maps/api";
import InputComponent from "./InputComponent";
import ButtonComponent from "~/components/ButtonComponent";
import {
  Card,
  CardBody,
  Stack,
  VStack,
  Heading,
  Text,
  useToast,
  Flex,
  Box,
} from "@chakra-ui/react";
import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useLoading } from "~/hooks/useLoading";
import { Autocomplete } from "@react-google-maps/api";
import useCurrentPosition from "~/hooks/useCurrentPosition";
import { useRef, useState } from "react";
import useCalculateTripValue from "~/hooks/useCalculateTripValue";
import useRetrieveRouteInfo from "~/hooks/useRetrieveRouteInfo";

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
    startLoading();
    try {
      console.log(data);
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
    >
      {pickupLocationRef.current && dropoffLocationRef.current && (
        <>
          <Marker position={pickupLocationRef.current} />
          <Marker position={dropoffLocationRef.current} />
          <DirectionsRenderer
            directions={directions ?? undefined}
            options={{
              polylineOptions: {
                strokeColor: "#845ec2",
                strokeWeight: 5,
              },
            }}
          />
        </>
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
            {!distanceDetails.distance ||
            (!distanceDetails.value && !directions) ? (
              <>
                <Autocomplete
                  onLoad={(autocomplete) => {
                    autocomplete.addListener("place_changed", () => {
                      const place = autocomplete.getPlace();
                      const lat = place.geometry?.location?.lat();
                      const lng = place.geometry?.location?.lng();

                      pickupLocationRef.current = {
                        lat: lat ?? 0,
                        lng: lng ?? 0,
                      };
                    });
                  }}
                >
                  <InputComponent
                    label="Get a ride"
                    register={register}
                    name="pickupLocation"
                    placeholder="Origin"
                  />
                </Autocomplete>
                <Autocomplete
                  onLoad={(autocomplete) => {
                    autocomplete.addListener("place_changed", () => {
                      const place = autocomplete.getPlace();
                      const lat = place.geometry?.location?.lat();
                      const lng = place.geometry?.location?.lng();

                      dropoffLocationRef.current = {
                        lat: lat ?? 0,
                        lng: lng ?? 0,
                      };
                    });
                  }}
                >
                  <InputComponent
                    label="Where to?"
                    register={register}
                    name="dropoffLocation"
                    placeholder="Destination"
                  />
                </Autocomplete>

                <ButtonComponent onClick={retrieveRouteInfo} loading={loading}>
                  Search 🔍
                </ButtonComponent>
              </>
            ) : (
              <Stack>
                <Flex align={"center"}>
                  <Box p={2}>
                    <Heading size="sm" fontWeight={""}>
                      Distance
                    </Heading>
                    <Text fontSize="md" fontWeight={"bold"} color={"primary"}>
                      {distanceDetails.distance}
                    </Text>
                  </Box>

                  <Box p={2}>
                    <Heading size="sm" fontWeight={""}>
                      Value
                    </Heading>
                    <Text fontSize="md" fontWeight={"bold"} color={"green"}>
                      {tripValue}
                    </Text>
                  </Box>
                </Flex>
                <ButtonComponent type="submit" loading={loading}>
                  Request Goober Driver
                </ButtonComponent>
                <ButtonComponent
                  textOnly
                  onClick={() => {
                    setDistanceDetails({
                      value: 0,
                      distance: "",
                    });
                  }}
                >
                  Go Back
                </ButtonComponent>
              </Stack>
            )}
          </VStack>
        </CardBody>
      </Card>
    </GoogleMap>
  );
};

export default Map;

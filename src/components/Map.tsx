import { GoogleMap } from "@react-google-maps/api";
import InputComponent from "./InputComponent";
import ButtonComponent from "~/components/ButtonComponent";
import { Card, CardBody, VStack, useToast } from "@chakra-ui/react";
import { api } from "~/utils/api";
import { useAuth } from "~/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { useLoading } from "~/hooks/useLoading";
import { Autocomplete } from "@react-google-maps/api";
import useCurrentPosition from "~/hooks/useCurrentPosition";

const schema = z.object({
  pickupLocation: z.string(),
  dropoffLocation: z.string(),
});

type FormInputsProps = z.infer<typeof schema>;

const Map: React.FC = () => {
  const { user } = useAuth();
  const { position } = useCurrentPosition();
  const ride = api.ride.createRide.useMutation();
  const toast = useToast();
  const { loading, startLoading, stopLoading } = useLoading();

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
      mapContainerStyle={{ width: "100%", height: "100vh" }}
      center={{
        lat: position.latitude,
        lng: position.longitude,
      }}
    >
      <Card bgColor={"transparent"}>
        <CardBody>
          <VStack
            as="form"
            onSubmit={handleSubmit(onSubmit)}
            spacing={4}
            w="full"
            maxW="md"
          >
            <Autocomplete>
              <InputComponent
                label="Get a ride"
                register={register}
                name="pickupLocation"
                placeholder="Origin"
              />
            </Autocomplete>
            <Autocomplete>
              <InputComponent
                label="Where to?"
                register={register}
                name="dropoffLocation"
                placeholder="Destination"
              />
            </Autocomplete>

            <ButtonComponent type="submit" loading={loading}>
              Find Goober Driver
            </ButtonComponent>
          </VStack>
        </CardBody>
      </Card>
    </GoogleMap>
  );
};

export default Map;

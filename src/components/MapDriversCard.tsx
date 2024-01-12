import React from "react";
import {
  Box,
  Card,
  CardBody,
  HStack,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import ButtonComponent from "./ButtonComponent";
import { IoCarSharp, IoCarSportSharp } from "react-icons/io5";
import useCalculateTripValue from "~/hooks/useCalculateTripValue";

type DriverTypes = {
  id: number;
  type: string;
};

type MapDriversCardProps = {
  type: RideType;
  drivers: DriverTypes[];
  loading: boolean;
  distanceValue: number;
  onSubmit: (
    rideType: "Regular" | "Luxury",
    tripValue: number,
  ) => Promise<void>;
};

type RideType = "Regular" | "Luxury" | undefined;

const MapDriversCard: React.FC<MapDriversCardProps> = ({
  type,
  drivers,
  loading,
  distanceValue,
  onSubmit,
}) => {
  const toast = useToast();
  const driversOfType = drivers.filter((driver) => driver.type === type);

  const tripValue = useCalculateTripValue(distanceValue, type);

  return (
    <Card
      bgColor={"light"}
      boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
      as={"form"}
      onSubmit={async (event) => {
        event.preventDefault();
        if (type) {
          await onSubmit(type, tripValue);
        } else {
          toast({
            title: "Error",
            description: "This type of ride is not available anymore.",
            status: "error",
            position: "top",
            duration: 4000,
            isClosable: true,
          });
          return;
        }
      }}
      mb={2}
    >
      <HStack>
        <Box
          borderRadius="full"
          bg="gray.200"
          p={2}
          ml={2}
          textAlign={"center"}
        >
          <Text fontSize={"xs"}>{driversOfType.length}x</Text>
        </Box>
        <CardBody p={2}>
          <Heading size="sm" fontWeight={"bold"} color={"secondary"}>
            {type}
          </Heading>
          <HStack>
            <Text size="xs">Value:</Text>
            <Text fontSize="md" fontWeight={"bold"} color={"green"}>
              ${tripValue}
            </Text>
          </HStack>
          <ButtonComponent
            type="submit"
            loading={loading}
            outline
            color={"secondary"}
            leftIcon={
              type === "Regular" ? (
                <IoCarSharp size={24} />
              ) : (
                <IoCarSportSharp size={24} />
              )
            }
          >
            Request
          </ButtonComponent>
        </CardBody>
      </HStack>
    </Card>
  );
};

export default MapDriversCard;

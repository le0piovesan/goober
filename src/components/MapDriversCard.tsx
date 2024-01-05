import React from "react";
import { Box, Card, CardBody, HStack, Heading, Text } from "@chakra-ui/react";
import ButtonComponent from "./ButtonComponent";
import { IoCarSharp, IoCarSportSharp } from "react-icons/io5";

type DriverTypes = {
  id: number;
  type: string;
};

type MapDriversCardProps = {
  type: string;
  drivers: DriverTypes[];
  tripValue: number;
  loading: boolean;
};

const MapDriversCard: React.FC<MapDriversCardProps> = ({
  type,
  drivers,
  tripValue,
  loading,
}) => {
  const driversOfType = drivers.filter((driver) => driver.type === type);

  if (driversOfType.length === 0) {
    return null;
  }

  return (
    <Card
      bgColor={"light"}
      boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
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
              ${type === "Regular" ? tripValue : (tripValue * 1.2).toFixed(2)}
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

import { Box, Heading, Flex, Text } from "@chakra-ui/react";
import ButtonComponent from "./ButtonComponent";

type MapDetailsProps = {
  distanceDetails: string;
  setDistanceDetails: React.Dispatch<
    React.SetStateAction<{
      value: number;
      distance: string;
    }>
  >;
  tripValue: number;
  loading: boolean;
};

const MapDetails: React.FC<MapDetailsProps> = ({
  distanceDetails,
  setDistanceDetails,
  tripValue,
  loading,
}) => (
  <>
    <Flex align={"center"}>
      <Box p={2}>
        <Heading size="sm" fontWeight={""}>
          Distance
        </Heading>
        <Text fontSize="md" fontWeight={"bold"} color={"primary"}>
          {distanceDetails}
        </Text>
      </Box>

      <Box p={2}>
        <Heading size="sm" fontWeight={""}>
          Value
        </Heading>
        <Text fontSize="md" fontWeight={"bold"} color={"green"}>
          $ {tripValue}
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
  </>
);

export default MapDetails;

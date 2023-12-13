import {
  Box,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Stack,
  Image,
  Text,
} from "@chakra-ui/react";

import type { RideWithStatus } from "~/types/ride";

interface RideCardProps {
  ride: RideWithStatus;
}

const RideCard: React.FC<RideCardProps> = ({ ride }) => (
  <Card>
    <CardBody>
      <Image
        src="https://placekitten.com/1000/300"
        alt="Green double couch with wooden legs"
        borderRadius="lg"
      />
      <Stack mt="2" spacing="1">
        <Heading size="md" color={"yellow.600"}>
          {ride.status.current === "REQUESTED"
            ? "Looking for a Driver"
            : "TODO: Add status"}
        </Heading>
        <Text>
          Distance:{" "}
          <Text as="span" color="primary" fontSize="md">
            {ride.distance}
          </Text>
        </Text>
        <Text>
          Value:{" "}
          <Text as="span" color="green.600" fontSize="md" fontWeight={"bold"}>
            $ {ride.tripFee}
          </Text>
        </Text>
      </Stack>
    </CardBody>
    <Divider />
    <CardFooter>
      <Box>
        <Text fontSize="sm">
          Requested at:{" "}
          {ride.createdAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          {ride.createdAt.toLocaleDateString()}
        </Text>
        <Text fontSize="xs">
          Updated at:{" "}
          {ride.updatedAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}{" "}
          {ride.updatedAt.toLocaleDateString()}
        </Text>
      </Box>
    </CardFooter>
  </Card>
);

export default RideCard;

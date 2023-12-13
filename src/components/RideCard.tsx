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
import { formatDateTime } from "~/utils/dateFormatter";
import { colorStatus } from "~/utils/colorFormatter";

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
        <Heading size="md" color={colorStatus(ride.status.current)}>
          {ride.status.current}
        </Heading>
        <Text>
          From:{" "}
          <Text as="span" fontSize="md" fontWeight={"bold"}>
            {ride.originName}
          </Text>
        </Text>
        <Text>
          To:{" "}
          <Text as="span" fontSize="md" fontWeight={"bold"}>
            {ride.destinationName}
          </Text>
        </Text>
        <Text>
          Distance:{" "}
          <Text as="span" fontSize="md" fontWeight={"bold"}>
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
          Requested at: {formatDateTime(ride.createdAt)}
        </Text>
        <Text fontSize="xs">Updated at: {formatDateTime(ride.updatedAt)}</Text>
      </Box>
    </CardFooter>
  </Card>
);

export default RideCard;

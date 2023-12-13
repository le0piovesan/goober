import {
  ListIcon,
  ListItem,
  Box,
  VStack,
  Text,
  Badge,
  HStack,
} from "@chakra-ui/react";
import type { NotificationWithRide } from "~/types/notification";
import { ImCheckboxUnchecked } from "react-icons/im";
import { useAuth } from "~/context/AuthContext";
import ButtonComponent from "./ButtonComponent";

const NotificationCard: React.FC<{ notification: NotificationWithRide }> = ({
  notification,
}) => {
  const { user } = useAuth();

  return (
    <ListItem marginBottom="2">
      <Box maxW="sm" borderWidth="1px" borderRadius="lg" overflow="hidden">
        <VStack padding="2" align="start">
          <HStack>
            <ListIcon
              as={ImCheckboxUnchecked as React.ElementType}
              color="yellow.500"
            />
            <Text fontWeight={"bold"} fontSize="md">
              {notification.message}
            </Text>
          </HStack>
          {user?.type === "Driver" && (
            <>
              <Text>
                The trip fee is:{" "}
                <Text
                  as="span"
                  fontSize="md"
                  fontWeight={"bold"}
                  color={"green"}
                >
                  $ {notification.ride?.tripFee}
                </Text>
              </Text>
              <HStack>
                <ButtonComponent
                  onClick={() => {
                    console.log("Accept");
                  }}
                >
                  Accept
                </ButtonComponent>
                <ButtonComponent
                  decline
                  onClick={() => {
                    console.log("Decline");
                  }}
                >
                  Decline
                </ButtonComponent>
              </HStack>
            </>
          )}
          <Badge colorScheme="yellow">New</Badge>
        </VStack>
      </Box>
    </ListItem>
  );
};

export default NotificationCard;

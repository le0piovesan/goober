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
  ListIcon,
  ListItem,
} from "@chakra-ui/react";
import type { Notification } from "@prisma/client";
import { ImCheckboxUnchecked, ImCheckboxChecked } from "react-icons/im";

const NotificationCard: React.FC<{ notification: Notification }> = ({
  notification,
}) => (
  <ListItem id={notification.id.toString()}>
    <ListIcon as={ImCheckboxUnchecked as React.ElementType} color="green.500" />
    {notification.message}
  </ListItem>
);

export default NotificationCard;

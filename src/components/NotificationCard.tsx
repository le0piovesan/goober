import { ListIcon, ListItem } from "@chakra-ui/react";
import type { Notification } from "@prisma/client";
import { ImCheckboxUnchecked } from "react-icons/im";

const NotificationCard: React.FC<{ notification: Notification }> = ({
  notification,
}) => (
  <ListItem>
    <ListIcon as={ImCheckboxUnchecked as React.ElementType} color="green.500" />
    {notification.message}
  </ListItem>
);

export default NotificationCard;

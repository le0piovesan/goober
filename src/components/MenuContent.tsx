import { Box, Card, Flex, Text } from "@chakra-ui/react";
import { FiMap, FiMapPin, FiBell, FiLogOut } from "react-icons/fi";
import ButtonComponent from "./ButtonComponent";
import { useAuth } from "~/context/AuthContext";
import { useRouter } from "next/router";

interface MenuContentProps {
  onClose?: () => void;
}

const MenuContent: React.FC<MenuContentProps> = ({ onClose }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const currentPath = router.pathname;

  const menuItems = [
    { href: "/rides/feed", icon: <FiMap size={24} />, label: "Home" },
    {
      href: "/rides/call",
      icon: <FiMapPin size={24} />,
      label: "Find Goober Driver",
    },
    {
      href: "/notifications/list",
      icon: <FiBell size={24} />,
      label: "Notifications",
    },
  ];

  const handleMenuItemClick = async (href: string) => {
    if (onClose) onClose();
    await router.replace(href);
  };

  return (
    <Card bgColor={"light"} boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}>
      <Flex
        align={"flex-start"}
        direction={"column"}
        p={4}
        m={2}
        overflow="hidden"
        position="sticky"
        top={0}
      >
        {user && user.isLoggedIn && (
          <Box>
            <Text fontSize="md" color={"gray"}>
              Hello, {user?.name}
            </Text>
            <Text fontSize="md" color={"primary"}>
              {user?.type === "Driver" ? "Driver" : "Rider"} Menu
            </Text>
          </Box>
        )}
        {menuItems
          .filter(
            (route) =>
              route.href !== "/rides/call" || (user && user.type === "Rider"),
          )
          .map((item) => (
            <ButtonComponent
              key={item.href}
              onClick={() =>
                handleMenuItemClick(currentPath === item.href ? "#" : item.href)
              }
              outline
              leftIcon={item.icon}
              className="my-2"
            >
              {item.label}
            </ButtonComponent>
          ))}
        <ButtonComponent
          onClick={() => logout()}
          outline
          declineCancel
          leftIcon={<FiLogOut size={24} />}
          className="mt-2"
        >
          Log Out
        </ButtonComponent>
      </Flex>
    </Card>
  );
};

export default MenuContent;

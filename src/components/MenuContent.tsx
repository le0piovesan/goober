import { Flex } from "@chakra-ui/react";
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
    await router.push(href);
  };

  return (
    <Flex
      align={"flex-start"}
      direction={"column"}
      p={4}
      m={2}
      overflow="hidden"
      border={"1px solid"}
      borderRadius={"lg"}
      borderColor={"light"}
      bgColor={"#fff"}
    >
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
        leftIcon={<FiLogOut size={24} />}
        className="mt-2"
      >
        Log Out
      </ButtonComponent>
    </Flex>
  );
};

export default MenuContent;

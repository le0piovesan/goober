import {
  Box,
  Card,
  Flex,
  Text,
  Divider,
  Center,
  Skeleton,
} from "@chakra-ui/react";
import { FiMap, FiMapPin, FiBell, FiLogOut } from "react-icons/fi";
import ButtonComponent from "./ButtonComponent";
import { useAuth } from "~/context/AuthContext";
import { useRouter } from "next/router";
import supabase from "~/utils/supabaseClient";
import Image from "next/image";
import { useLoading } from "~/hooks/useLoading";

interface MenuContentProps {
  onClose?: () => void;
}

const MenuContent: React.FC<MenuContentProps> = ({ onClose }) => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const currentPath = router.pathname;
  const { loading, startLoading } = useLoading();

  const getAvatar = (path: string) => {
    const imageUrl = supabase.storage.from("avatar").getPublicUrl(path);
    return imageUrl.data.publicUrl;
  };

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
    <Card
      bgColor={"light"}
      boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
      borderRadius={"xl"}
      mt={12}
    >
      {user?.email && (
        <Center>
          <Box
            className="absolute -top-14 rounded-full border-8 border-primary "
            height={"80px"}
            width={"80px"}
          >
            <Image
              src={getAvatar(user?.email)}
              onLoad={() => startLoading()}
              fill
              alt="User avatar"
              className="rounded-full"
              style={{
                objectFit: "cover",
              }}
            />

            {!loading && (
              <Skeleton height="65px" width="65px" borderRadius="full" />
            )}
          </Box>
        </Center>
      )}
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
            <Text fontSize="xs" color={"primary"}>
              {user?.type === "Driver" ? "Driver" : "Rider"} Menu
            </Text>
          </Box>
        )}
        <Divider />
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
        <Divider />
      </Flex>
    </Card>
  );
};

export default MenuContent;

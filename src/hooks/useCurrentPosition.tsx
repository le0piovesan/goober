import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";
import { useAuth } from "~/context/AuthContext";
import { api } from "~/utils/api";

interface CurrentPositionProps {
  latitude: number;
  longitude: number;
}

const useCurrentPosition = () => {
  const [position, setPosition] = useState<CurrentPositionProps>({
    latitude: 0,
    longitude: 0,
  });
  const toast = useToast();
  const { user } = useAuth();
  const driver = api.driver.updateDriverLastLocation.useMutation();

  const savePosition = ({ coords }: { coords: CurrentPositionProps }) => {
    setPosition({
      latitude: coords.latitude,
      longitude: coords.longitude,
    });

    if (user && user.type === "Driver")
      driver.mutate({
        id: user.id,
        latitude: coords.latitude,
        longitude: coords.longitude,
      });
  };

  useEffect(() => {
    if (!navigator.geolocation) {
      toast({
        title: "Error",
        description: "Geolocation is not supported by your browser 😢",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(savePosition);
  }, []);

  return { position };
};

export default useCurrentPosition;

import React from "react";
import { Box } from "@chakra-ui/react";

type ActiveCardProps = {
  children: React.ReactNode;
};

const ActiveCard: React.FC<ActiveCardProps> = ({ children }) => {
  return (
    <Box
      position="relative"
      borderWidth={10}
      borderStyle="solid"
      borderColor="#48bb78"
      borderRadius="lg"
      animation="pulse 1.5s infinite"
      boxSizing="border-box"
      padding={4}
      mt={2}
    >
      {children}
    </Box>
  );
};

export default ActiveCard;

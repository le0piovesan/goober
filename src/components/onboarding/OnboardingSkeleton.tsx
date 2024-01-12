import { Center, HStack, Skeleton, VStack } from "@chakra-ui/react";
import React from "react";

const OnboardingSkeleton: React.FC = () => {
  return (
    <Center height="100vh">
      <VStack spacing={5}>
        <Skeleton height="20px" width="300px" />
        <Skeleton height="50px" width="400px" />
        <Skeleton height="50px" width="400px" />
        <Skeleton height="50px" width="400px" />
        <Skeleton height="50px" width="400px" />
        <HStack justifyContent={"space-between"}>
          <Skeleton height="50px" width="80px" />
          <Skeleton height="20px" width="30px" />
          <Skeleton height="50px" width="80px" />
        </HStack>
      </VStack>
    </Center>
  );
};

export default OnboardingSkeleton;

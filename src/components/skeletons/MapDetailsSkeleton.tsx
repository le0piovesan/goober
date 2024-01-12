import { HStack, Skeleton, VStack } from "@chakra-ui/react";
import React from "react";

const MapDetailsSkeleton: React.FC = () => {
  return (
    <>
      <VStack>
        <Skeleton height="20px" width="150px" />
        <HStack justifyContent={"space-between"}>
          <Skeleton height="20px" width="80px" />
          <Skeleton height="20px" width="80px" />
        </HStack>
        <Skeleton height="20px" width="150px" />
        <VStack>
          <Skeleton height="50px" width="200px" />
          <Skeleton height="50px" width="200px" />
        </VStack>
        <Skeleton height="50px" width="200px" />
      </VStack>
    </>
  );
};

export default MapDetailsSkeleton;

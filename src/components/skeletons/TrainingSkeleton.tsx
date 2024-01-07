import { Flex, Heading, Skeleton, Stack, Text } from "@chakra-ui/react";
import React from "react";

const TrainingSkeleton: React.FC = () => {
  return (
    <>
      <Heading textAlign={"center"} color={"primary"}>
        <Skeleton height="20px" width="200px" />
      </Heading>
      <Text textAlign={"center"}>
        <Skeleton height="20px" width="400px" />
      </Text>

      <Flex wrap={"wrap"} gap={4} justifyContent={"center"} my={4}>
        <Skeleton height="195px" width="320px" />
        <Skeleton height="195px" width="320px" />
      </Flex>

      <Stack spacing={5}>
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} height="50px" width="300px" />
        ))}
      </Stack>
    </>
  );
};

export default TrainingSkeleton;

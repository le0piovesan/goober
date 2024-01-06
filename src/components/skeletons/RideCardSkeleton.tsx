import { Box, Card, CardBody, Stack, Skeleton, HStack } from "@chakra-ui/react";

const RideCardSkeleton: React.FC = () => {
  return (
    <Card
      bgColor={"light"}
      mt={4}
      mb={2}
      boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
    >
      <CardBody>
        <Skeleton height="20px" width="180px" />
        <HStack justifyContent={"space-between"}>
          <Skeleton height="20px" width="180px" />
          <Skeleton height="20px" width="180px" />
        </HStack>
        <Skeleton height="100px" width="100%" />
        <Stack mt="2" spacing="1">
          <Stack
            direction={{ base: "column", md: "row" }}
            spacing={{ base: 2, md: 4 }}
            justifyContent="space-between"
          >
            <Skeleton height="20px" width="180px" />
          </Stack>
          <HStack justifyContent={"space-between"}>
            <Box>
              <Skeleton height="20px" width="180px" />
              <Skeleton height="20px" width="180px" />
            </Box>
            <Box textAlign="right">
              <Skeleton height="20px" width="180px" />
              <Skeleton height="20px" width="180px" />
            </Box>
          </HStack>
        </Stack>
      </CardBody>
    </Card>
  );
};

export default RideCardSkeleton;

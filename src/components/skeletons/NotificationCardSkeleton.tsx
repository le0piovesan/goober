import { Card, CardBody, Skeleton, HStack, VStack } from "@chakra-ui/react";

const NotificationCardSkeleton: React.FC = () => {
  return (
    <Card
      bgColor={"light"}
      mb={2}
      boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
      height={"90px"}
    >
      <CardBody>
        <VStack spacing={1}>
          <Skeleton height="10px" width="100px" />
          <HStack justifyContent={"space-between"} spacing={1}>
            <Skeleton height="10px" width="150px" />
            <Skeleton height="10px" width="150px" />
          </HStack>
          <HStack justifyContent={"space-between"} spacing={1}>
            <VStack spacing={1}>
              <Skeleton height="10px" width="100px" />
              <Skeleton height="10px" width="100px" />
            </VStack>
          </HStack>
        </VStack>
      </CardBody>
    </Card>
  );
};

export default NotificationCardSkeleton;

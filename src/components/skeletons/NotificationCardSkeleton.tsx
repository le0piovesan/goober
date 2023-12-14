import { Card, CardBody, Skeleton, HStack, Box } from "@chakra-ui/react";

const NotificationCardSkeleton: React.FC = () => {
  return (
    <Card
      bgColor={"light"}
      mb={2}
      boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
      height={"50px"}
    >
      <CardBody>
        <Skeleton height="20px" width="100px" />
        <HStack justifyContent={"space-between"}>
          <Skeleton height="20px" width="150px" />
          <Skeleton height="20px" width="150px" />
        </HStack>
        <Skeleton height="200px" />
        <HStack justifyContent={"space-between"}>
          <Box>
            <Skeleton height="20px" width="100px" />
            <Skeleton height="20px" width="100px" />
          </Box>
          <Box textAlign="right">
            <Skeleton height="20px" width="80px" />
            <Skeleton height="20px" width="80px" />
          </Box>
        </HStack>
      </CardBody>
    </Card>
  );
};

export default NotificationCardSkeleton;

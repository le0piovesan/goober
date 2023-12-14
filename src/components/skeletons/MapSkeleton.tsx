import { Box, Skeleton } from "@chakra-ui/react";

const MapSkeleton: React.FC = () => {
  return (
    <Box position="relative" width="100%" height="400px">
      <Skeleton height="80vh" />
    </Box>
  );
};

export default MapSkeleton;

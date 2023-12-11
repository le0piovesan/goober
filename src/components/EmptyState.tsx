import { Box, Heading, Text } from "@chakra-ui/react";

interface EmptyStateProps {
  title: string;
  subtext: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, subtext }) => (
  <Box
    display="flex"
    flexDirection="column"
    alignItems="center"
    justifyContent="center"
    padding={4}
    margin={4}
    width="100%"
    height="100%"
  >
    <Heading marginBottom={2}>{title}</Heading>
    <Text>{subtext}</Text>
  </Box>
);

export default EmptyState;

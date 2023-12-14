import { Card, Text } from "@chakra-ui/react";

interface EmptyStateProps {
  title: string;
  subtext: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ title, subtext }) => {
  return (
    <Card
      bgColor="light"
      display="flex"
      alignItems="center"
      justifyContent="center"
      padding={4}
      margin={4}
      boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
    >
      <Text fontSize={"xl"}>{title}</Text>
      <Text fontSize={"md"}>{subtext}</Text>
    </Card>
  );
};

export default EmptyState;

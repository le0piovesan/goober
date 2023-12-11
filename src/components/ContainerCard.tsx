import { Flex, Grid } from "@chakra-ui/react";
import CardComponent from "./CardComponent";

const ContainerCard = () => (
  <Flex direction="column">
    <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={6}>
      <CardComponent>CardComponent 1</CardComponent>
      <CardComponent>CardComponent 2</CardComponent>
      <CardComponent>CardComponent 3</CardComponent>
    </Grid>
  </Flex>
);

export default ContainerCard;

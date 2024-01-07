import { Heading, Text } from "@chakra-ui/react";
import React from "react";

const Training: React.FC = () => {
  return (
    <>
      <Heading textAlign={"center"} color={"primary"}>
        You are almost there!
      </Heading>
      <Text textAlign={"center"}>
        In order to start receiving ride requests, you must watch the following
        videos and answer some quiz questions.
      </Text>
    </>
  );
};

export default Training;

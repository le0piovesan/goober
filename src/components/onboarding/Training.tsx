import { Flex, Heading, Text, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import ButtonComponent from "~/components/ButtonComponent";
import YouTube from "react-youtube";
import Quiz from "~/components/onboarding/Quiz";
import { api } from "~/utils/api";
import { useLoading } from "~/hooks/useLoading";
import { useRouter } from "next/navigation";
import TrainingSkeleton from "../skeletons/TrainingSkeleton";

type Answers = Record<string, string>;

const Training: React.FC<{ userId: number }> = ({ userId }) => {
  const [stepsCompleted, setStepsCompleted] = useState({
    first: false,
    second: false,
  });
  const [answers, setAnswers] = useState<Answers>({});
  const { data: quiz, isLoading: isFetching } = api.quiz.getQuiz.useQuery();
  const completeQuiz = api.quiz.completeQuiz.useMutation();
  const { loading, startLoading, stopLoading } = useLoading();
  const toast = useToast();
  const router = useRouter();

  const allQuestionsAnsweredCorrectly = quiz?.every(
    (question) => answers[question.id] === question.correctAnswer,
  );

  const finishTraining = async () => {
    try {
      startLoading();

      await completeQuiz.mutateAsync({ id: userId });

      toast({
        title: "Training Completed! 🎉",
        description: "You can now receive ride requests.",
        status: "success",
        position: "top",
        duration: 4000,
        isClosable: true,
      });
      void router.refresh();
    } catch (error) {
      if (error instanceof Error)
        toast({
          title: "Error",
          description: `${error.message} 😢`,
          status: "error",
          duration: 4000,
          isClosable: true,
        });
    } finally {
      stopLoading();
    }
  };

  if (isFetching || loading) return <TrainingSkeleton />;

  return (
    <>
      <Heading textAlign={"center"} color={"primary"}>
        You are almost there!
      </Heading>
      <Text textAlign={"center"}>
        In order to start receiving ride requests, you must watch the following
        videos and answer some quiz questions.
      </Text>

      <Flex wrap={"wrap"} gap={4} justifyContent={"center"} my={4}>
        <YouTube
          videoId="JvEFw2AGLOw"
          opts={{
            height: "195",
            width: "320",
          }}
          onEnd={() =>
            setStepsCompleted((prevState) => ({ ...prevState, first: true }))
          }
        />
        <YouTube
          videoId="TD6CZsvAH8U"
          opts={{
            height: "195",
            width: "320",
          }}
          onEnd={() =>
            setStepsCompleted((prevState) => ({ ...prevState, second: true }))
          }
        />
      </Flex>

      {quiz && (
        <Quiz questions={quiz} answers={answers} setAnswers={setAnswers} />
      )}

      <ButtonComponent
        disabled={
          !stepsCompleted.first ||
          !stepsCompleted.second ||
          !allQuestionsAnsweredCorrectly
        }
        onClick={finishTraining}
      >
        Complete Training
      </ButtonComponent>
    </>
  );
};

export default Training;

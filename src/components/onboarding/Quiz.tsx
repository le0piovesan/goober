import {
  Card,
  CardBody,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";

type Question = {
  id: number;
  question: string;
  answerA: string;
  answerB: string;
  answerC: string;
  answerD: string;
  answerE: string;
  correctAnswer: string;
};

type QuizProps = {
  questions: Question[];
  answers: Record<string, string>;
  setAnswers: React.Dispatch<React.SetStateAction<Record<string, string>>>;
};

const Quiz: React.FC<QuizProps> = ({ questions, answers, setAnswers }) => {
  const answerOptions = ["A", "B", "C", "D", "E"];

  return (
    <VStack>
      {questions.map((question) => (
        <Card
          key={question.id}
          bgColor={"light"}
          boxShadow={"0px 4px 4px rgba(0, 0, 0, 0.25)"}
          width={"100%"}
        >
          <CardBody>
            <Text fontWeight={"bold"} color={"primary"}>
              {question.question}
            </Text>
            <RadioGroup
              onChange={(value) =>
                setAnswers((prev) => ({ ...prev, [question.id]: value }))
              }
              value={answers[question.id]}
            >
              <Stack direction="column">
                {answerOptions.map((option) => (
                  <Radio
                    key={option}
                    value={option}
                    size={"md"}
                    color={"primary"}
                    _checked={{
                      bg: "primary",
                    }}
                    _hover={{
                      borderColor: "secondary",
                    }}
                  >
                    {question[`answer${option}` as keyof Question]}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
          </CardBody>
        </Card>
      ))}
    </VStack>
  );
};

export default Quiz;

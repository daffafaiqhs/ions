import {
  Flex,
  Heading,
  Text,
  Divider,
  Box,
  Input,
  Button,
  FormLabel,
  Switch,
  Tooltip as ChakraTooltip,
  Center,
} from "@chakra-ui/react";
import { FiInfo } from "react-icons/fi";
import Header from "./Header";
import { useState } from "react";

function Assistans({ fileData, header }) {
  // false = microsoft/phi | true = google/tapas
  const [aiModel, setAiModel] = useState(false);
  const [query, setQuery] = useState("");
  const [aiResponse, setAiresponse] = useState("");
  const [aiContext, setAiContext] = useState("");
  const [isFileUploaded, setIsFileUploaded] = useState("");

  const handleChangeAI = () => {
    setAiModel(!aiModel);
  };

  const handleSend = async () => {
    let sendBody = { query: query, context: aiContext };
    if (aiModel) {
      sendBody.data = fileData;
      sendBody.header = header;
    }

    setIsFileUploaded("trying");

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/chat?id=${aiModel ? 1 : 0}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sendBody),
        }
      );
      const data = await response.json();

      let splitData = data.content.split(", ");
      let filterData = Array.from(new Set(splitData));

      data.content = aiModel ? filterData : data.content;

      if (data.content[0] === "") {
        data.content =
          "Whoops! It seems like SPARK cannot answer that question. Can you ask another question?";
      }

      setAiresponse(data.content);
      if (!aiModel) {
        setAiContext(data.content);
      }

      let currentStatus;
      if (response.ok) {
        currentStatus = "ok";
        setIsFileUploaded(currentStatus);
        console.log("Query send successfully!");
      } else {
        currentStatus = "error";
        setIsFileUploaded(currentStatus);
        setAiresponse("");
        console.log("Query failed!");
      }

      if (currentStatus === "ok") {
        setQuery("");
      }
    } catch (error) {
      setIsFileUploaded("error");
      setAiresponse("");
      console.error(error);
    }
  };

  return (
    <Flex direction={"column"} h={"100vh"}>
      <Header />
      <Flex
        mt={"100px"}
        mx={40}
        mb={"40px"}
        border={"4px solid #EAEAEA"}
        borderRadius={"14px"}
        bgColor={"#FCFCFC"}
        shadow={"0px 0px 50px 5px rgba(0,0,0,0.1)"}
        p={"24px"}
        py={"32px"}
        h={"100vh"}
        flexDir={"column"}
      >
        <Flex alignItems={"center"} gap={"12px"}>
          <Heading>SPARK</Heading>
          <ChakraTooltip
            label="Smart Power Assistant for Resource and Kilowatt savings."
            fontSize="md"
          >
            <span style={{ height: "fit-content" }}>
              <FiInfo />
            </span>
          </ChakraTooltip>
        </Flex>
        <Text fontSize={"xl"}>
          Your personal artificial intelligence assistant.
        </Text>
        <Divider
          my={"30px"}
          border={"1px solid #BEBEBE"}
          borderRadius={"4px"}
        />
        <Box flexGrow={1}>
          {isFileUploaded === "error" ? (
            <Text color={"red"}>
              SPARK is currently booting up! Please wait a bit before sending
              the question again.
            </Text>
          ) : (
            <Text fontSize={"xl"}>{aiResponse}</Text>
          )}
        </Box>
        <Flex
          justifyContent={"space-between"}
          alignItems={"center"}
          gap={"8px"}
        >
          <Text fontWeight={"semibold"}>
            Note: Please use english when asking question to SPARK.
          </Text>
          <Center gap={"8px"}>
            <Flex alignItems={"center"} gap={"4px"}>
              <ChakraTooltip
                label="Switch right to ask about the uploaded file, or left for unrelated questions."
                fontSize="md"
              >
                <span style={{ height: "fit-content" }}>
                  <FiInfo />
                </span>
              </ChakraTooltip>
              <FormLabel htmlFor="with-file" m="0">
                Include uploaded file data for AI queries:
              </FormLabel>
            </Flex>
            <Switch id="with-file" onChange={handleChangeAI} />
          </Center>
        </Flex>
        <Flex gap={"20px"} mt={"30px"} alignItems={"center"}>
          <Input
            placeholder="Ask SPARK anything about electricity here!"
            size={"lg"}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button
            variant="solid"
            size={"lg"}
            bg={"#1E1E1E"}
            color={"white"}
            onClick={handleSend}
            {...(isFileUploaded === "trying"
              ? { isLoading: true, loadingText: "Sending" }
              : {})}
          >
            Send
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
}
export default Assistans;

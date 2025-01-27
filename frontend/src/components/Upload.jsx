import {
  Text,
  Center,
  Heading,
  Link,
  Box,
  Flex,
  Divider,
  Button,
  AbsoluteCenter,
} from "@chakra-ui/react";
import { FiExternalLink, FiUpload } from "react-icons/fi";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import ThreeDotsWave from "../assets/ThreeDotsWave";
import { dummy_data } from "./dummy_data";

function DashboardInput({ setFileData }) {
  const fileInputRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reset input value
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsHovered(true);
  };

  const handleDragLeave = () => {
    setIsHovered(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsHovered(false);
    setIsFileUploaded("");

    const selectedFile = e.dataTransfer.files[0];

    if (selectedFile.type === "text/csv") {
      handleUploadFile(selectedFile);
    }

    resetFileInput();
  };

  const handleFileInput = (e) => {
    const selectedFile = e.target.files[0];
    handleUploadFile(selectedFile);
    setIsFileUploaded("");

    resetFileInput();
  };

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleUploadFile = async (file) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:8080/api/v1/upload", {
        method: "POST",
        body: formData,
      });
      let data = await response.json();
      setFileData(data);

      await delay(2000);

      // const data = await response.json();
      // console.log(data);

      // setInsightData(data);
      setIsUploading(false);

      if (response.ok) {
        setIsFileUploaded("ok");
        console.log("File uploaded successfully!");
        navigate("/dashboard");
      } else {
        setIsFileUploaded("error");
        console.log("Failed to upload the file.");
      }
    } catch (error) {
      setIsUploading(false);
      setIsFileUploaded("error");
      console.error("Error uploading file:", error);
    }
  };

  const handleUseIONS = () => {
    setFileData(dummy_data);
    setIsFileUploaded("ok");
    console.log("File uploaded successfully!");
    navigate("/dashboard");
  };

  return (
    <Flex direction={"column"} h={"100vh"}>
      <Header />
      <Center flexDir={"column"} mt={"120px"} gap={"50px"}>
        <Center
          flexDir={"column"}
          width={"60vw"}
          textAlign={"center"}
          gap={"16px"}
        >
          <Heading>Upload your energy consumption data</Heading>
          <Text>
            With your energy consumption data, we will create beautiful
            visualizations to help you understand usage patterns, uncover
            insights like what appliance use most of your electricity, and
            identify any faulty or inefficient appliances using AI-powered
            analysis. If you don't have one,{" "}
            <Link
              href="https://docs.google.com/spreadsheets/d/1Eq3Lr_oGDOg6OjwC6DKIU_kyD0TtCxpo/edit?usp=sharing&ouid=114568766220609996325&rtpof=true&sd=true"
              isExternal
              color="brand.primary"
              display={"inline"}
              fontWeight={"semibold"}
            >
              download a sample file{" "}
              <FiExternalLink style={{ display: "inline" }} />
            </Link>
          </Text>
        </Center>
        <Center h="full" flexDir={"column"} gap={"10px"}>
          <Center flexDir={"column"} gap={"20px"}>
            <Button
              variant="solid"
              size={"lg"}
              bg={"#8669FF"}
              color={"white"}
              onClick={handleUseIONS}
              sx={{
                _hover: {
                  bg: "#5127FF", // Change the background color on hover
                },
              }}
            >
              Use data from your IONS appliances
            </Button>
          </Center>
          <Box position="relative" padding="10">
            <Divider
              border={"1px solid #BEBEBE"}
              borderRadius={"4px"}
              w={"60vw"}
            />
            <AbsoluteCenter bg="white" px="4">
              OR
            </AbsoluteCenter>
          </Box>
          <label>
            <Center
              flexDir={"column"}
              textAlign={"center"}
              gap={"60px"}
              h={"50vh"}
              w={"60vw"}
              cursor={"pointer"}
              border={"4px solid"}
              borderRadius={"14px"}
              borderColor={isHovered ? "brand.secondary" : "#EAEAEA"}
              bgColor={isHovered ? "brand.tertiary" : "#FCFCFC"}
              color={"#1E1E1E"}
              shadow={"0px 0px 50px 5px rgba(0,0,0,0.1)"}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              {isFileUploaded === "error" && (
                <Text color={"red"}>
                  Oh no! something went wrong. Please try again in a few
                  minutes.
                </Text>
              )}

              {/* <ThreeDotsWave /> */}
              {isUploading ? <ThreeDotsWave /> : <FiUpload fontSize={"10vh"} />}

              <Box>
                <Text fontSize="2xl">
                  <Box
                    as="span"
                    display={"inline"}
                    color={"brand.primary"}
                    fontWeight={"semibold"}
                  >
                    Click to upload
                  </Box>{" "}
                  or drag and drop
                </Text>
                <Text fontSize="md">Supported Format: CSV File</Text>
              </Box>
            </Center>
            <input
              type="file"
              ref={fileInputRef}
              accept=".csv"
              style={{ display: "none" }}
              onChange={handleFileInput}
            />
          </label>
        </Center>
      </Center>
    </Flex>
  );
}
export default DashboardInput;

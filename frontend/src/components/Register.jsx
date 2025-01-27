import {
  Button,
  Center,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Text,
  Link as ChakraLink,
  FormErrorMessage,
} from "@chakra-ui/react";
import MainLogo from "../assets/IonsMainLogo";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

function Register({
  inputEmail,
  setInputEmail,
  inputPassword,
  setInputPassword,
}) {
  const navigate = useNavigate();
  const [inputName, setInputName] = useState("");
  const [isError, setError] = useState(false);

  const handleRegister = async () => {
    setError(false);
    const sendBody = {
      fullname: inputName,
      email: inputEmail,
      password: inputPassword,
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sendBody),
      });

      if (response.ok) {
        console.log("register success!");
        setInputEmail("");
        setInputPassword("");
        setInputName("");
        navigate("/login");
      } else {
        console.log("register failed!");
        setError(true);
      }
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  return (
    <Center h={"100vh"}>
      <Flex
        border={"4px solid"}
        borderRadius={"14px"}
        borderColor={"#EAEAEA"}
        bgColor={"#FCFCFC"}
        color={"#1E1E1E"}
        shadow={"0px 0px 50px 5px rgba(0,0,0,0.1)"}
        w={"500px"}
        flexDir={"column"}
        // p={"40px"}
      >
        <Flex p={"20px"} bg={"black"} borderTopRadius={"14px"}>
          <MainLogo />
        </Flex>
        <Flex p={"20px"} pt={"40px"} flexDir={"column"} gap={"60px"}>
          <Flex flexDir={"column"} gap={"8px"}>
            <Heading>Create New Account</Heading>
            <Text fontSize={"lg"}>
              Please provide your information to create an account.
            </Text>
          </Flex>
          <Flex flexDir={"column"} gap={"20px"}>
            <FormControl isRequired>
              <FormLabel>Fullname</FormLabel>
              <Input
                type="text"
                placeholder="Input your name here"
                onChange={(e) => setInputName(e.target.value)}
              />
            </FormControl>
            <FormControl isRequired isInvalid={isError}>
              <FormLabel>Email address</FormLabel>
              <Input
                type="email"
                placeholder="Input your email here"
                value={inputEmail}
                onChange={(e) => {
                  setInputEmail(e.target.value);
                }}
              />
              {isError ? (
                <FormErrorMessage>Email already exist!</FormErrorMessage>
              ) : (
                ""
              )}
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Input your password here"
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                }}
              />
            </FormControl>
          </Flex>
          <Center flexDir={"column"} gap={"24px"}>
            <ChakraLink as={NavLink} to={"/login"} textDecor={"underline"}>
              Already have an account? Login here.
            </ChakraLink>
            <Button
              w={"100%"}
              variant="solid"
              size={"lg"}
              bg={"#1E1E1E"}
              color={"white"}
              sx={{
                _hover: {
                  bg: "brand.primary", // Change the background color on hover
                },
              }}
              mb={"40px"}
              onClick={handleRegister}
            >
              Register
            </Button>
          </Center>
        </Flex>
      </Flex>
    </Center>
  );
}
export default Register;

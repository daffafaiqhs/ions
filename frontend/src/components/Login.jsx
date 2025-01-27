import {
  Button,
  Center,
  Flex,
  FormControl,
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

function Login({ inputEmail, setInputEmail, inputPassword, setInputPassword }) {
  const navigate = useNavigate();
  const [isError, setError] = useState(false);

  const handleLogin = async () => {
    setError(false);
    const sendBody = {
      email: inputEmail,
      password: inputPassword,
    };

    try {
      const response = await fetch("http://localhost:8080/api/v1/login", {
        credentials: "include",
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sendBody),
      });

      if (response.ok) {
        console.log("Login success!");
        setInputEmail("");
        setInputPassword("");
        navigate("/upload");
      } else {
        console.log("Login failed!");
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
            <Heading>Authorization Required</Heading>
            <Text fontSize={"lg"}>
              Please login using your account to continue using this site.
            </Text>
          </Flex>
          <Flex flexDir={"column"} gap={"20px"}>
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
                <FormErrorMessage>
                  Email or password is incorrect!
                </FormErrorMessage>
              ) : (
                ""
              )}
            </FormControl>
            <FormControl isRequired isInvalid={isError}>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Input your password here"
                value={inputPassword}
                onChange={(e) => {
                  setInputPassword(e.target.value);
                }}
              />
              {isError ? (
                <FormErrorMessage>
                  Email or password is incorrect!
                </FormErrorMessage>
              ) : (
                ""
              )}
            </FormControl>
          </Flex>
          <Center flexDir={"column"} gap={"24px"}>
            <ChakraLink as={NavLink} to={"/register"} textDecor={"underline"}>
              Don't have an account? Register here.
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
              onClick={handleLogin}
            >
              Login
            </Button>
          </Center>
        </Flex>
      </Flex>
    </Center>
  );
}
export default Login;

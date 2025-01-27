import {
  Button,
  Center,
  Heading,
  Link as ChakraLink,
  Text,
  Box,
} from "@chakra-ui/react";
import MainLogo from "../assets/IonsMainLogo";
import { NavLink } from "react-router-dom";

function Boarding() {
  return (
    <Center
      direction={"column"}
      h={"100vh"}
      flexDir={"column"}
      gap={"60px"}
      background="linear-gradient(200deg, rgba(134,105,255,1) 0%, rgba(34,101,222,1) 100%)"
      color="white"
    >
      <Center flexDir={"column"}>
        <Box w={"20vw"}>
          <MainLogo width={"100%"} height={"100%"} />
        </Box>
        <Heading fontSize={"6xl"}>Smart Home Energy Management</Heading>
        <Text fontSize={"4xl"}>The Gen-Z Way to Manage Your Electricity</Text>
      </Center>
      <Center my={"20px"} gap={"20px"}>
        <ChakraLink as={NavLink} to={"/login"}>
          <Button size={"lg"}>Login</Button>
        </ChakraLink>
        <Text>or</Text>
        <ChakraLink as={NavLink} to={"/register"}>
          <Button size={"lg"}>Register</Button>
        </ChakraLink>
      </Center>
    </Center>
  );
}
export default Boarding;

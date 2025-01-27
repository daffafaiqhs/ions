import { HStack, Spacer, Link as ChakraLink, Text } from "@chakra-ui/react";
import { NavLink, useNavigate } from "react-router-dom";
import MainLogo from "../assets/IonsMainLogo";
import { useCookies } from "react-cookie";

function Header(props) {
  const { setFileData } = props;
  const navigate = useNavigate();
  const [, , removeCookie] = useCookies();

  const handleLogout = () => {
    removeCookie("session_token");
    setFileData([]);

    navigate("/");
  };

  return (
    <HStack
      bg="#1E1E1E"
      color="white"
      py={4}
      px={40}
      w={"100vw"}
      fontSize="lg"
      spacing="32px"
      position={"fixed"}
      zIndex={10}
    >
      <ChakraLink as={NavLink} to="/dashboard">
        <MainLogo />
      </ChakraLink>

      <HStack spacing="16px">
        <ChakraLink as={NavLink} to="/dashboard">
          Dashbord
        </ChakraLink>
        <ChakraLink as={NavLink} to="/entries">
          Entries
        </ChakraLink>
        <ChakraLink as={NavLink} to="/assistants">
          AI Assistant
        </ChakraLink>
      </HStack>
      <Spacer />
      <HStack spacing="16px">
        <ChakraLink as={NavLink} to="/upload">
          Change Data
        </ChakraLink>
        <Text
          onClick={handleLogout}
          _hover={{ color: "red.500" }}
          cursor={"pointer"}
        >
          Logout
        </Text>
        {/* <ChakraLink to="/dashbord">Need Help?</ChakraLink> */}
      </HStack>
    </HStack>
  );
}
export default Header;

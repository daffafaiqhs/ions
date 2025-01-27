import {
  Box,
  Flex,
  Heading,
  Table,
  TableContainer,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import Header from "./Header";

function Entries({ fileData, header }) {
  return (
    <Flex direction={"column"} h={"100vh"}>
      <Header />
      <Box py={"50px"}></Box>
      <Flex
        mx={40}
        mb={10}
        border={"4px solid #EAEAEA"}
        borderRadius={"14px"}
        bgColor={"#FCFCFC"}
        shadow={"0px 0px 50px 5px rgba(0,0,0,0.1)"}
        p={"24px"}
        py={"32px"}
        flexDir={"column"}
        gap={"40px"}
        h={"100%"}
        flexGrow={1}
        overflowY={"hidden"}
      >
        <Heading>Uploaded File Entries</Heading>
        <TableContainer overflowY={"scroll"}>
          <Table>
            <Thead>
              <Tr>
                <Th>Entry</Th>
                {header.map((v, index) => {
                  return <Th key={index}>{v}</Th>;
                })}
              </Tr>
            </Thead>
            <Tbody>
              {fileData.map((data, index) => {
                return (
                  <Tr
                    key={index}
                    bgColor={index % 2 === 0 ? "#E4EEFF" : "transparent"}
                  >
                    <Td>{index + 1}</Td>
                    <Td>{data.date}</Td>
                    <Td>{data.time}</Td>
                    <Td>{data.appliance}</Td>
                    <Td isNumeric>{data.energy_consumption} kWh</Td>
                    <Td>{data.room}</Td>
                    <Td>{data.status}</Td>
                  </Tr>
                );
              })}
            </Tbody>
            <Tfoot>
              <Tr>
                <Th>Entry</Th>
                {header.map((v, index) => {
                  return <Th key={index}>{v}</Th>;
                })}
              </Tr>
            </Tfoot>
          </Table>
        </TableContainer>
      </Flex>
    </Flex>
  );
}
export default Entries;

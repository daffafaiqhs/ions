import {
  Grid,
  GridItem,
  Spacer,
  Select,
  Box,
  Flex,
  Heading,
  Text,
  Center,
  Tooltip as ChakraTooltip,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Rectangle,
  Sector,
} from "recharts";
import { FiInfo } from "react-icons/fi";

import Header from "./Header";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const tariffByCurrents = [
  {
    current: "900 VA-RTM",
    tarrif: 1352,
  },
  {
    current: "1300VA",
    tarrif: 1444.7,
  },
  {
    current: "2200VA",
    tarrif: 1444.7,
  },
  {
    current: "3500VA - 5500VA",
    tarrif: 1699.53,
  },
  {
    current: "6600VA+",
    tarrif: 1699.53,
  },
];

let tariff = tariffByCurrents[0].tarrif;
let selectedMonth = MONTHS[0];
let selectedAppliance = "Air Conditioner";

const CustomTooltip = ({ active, payload, label, isPie }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        backgroundColor={"white"}
        p={"8px"}
        border={"1px solid #8c8c8c"}
        borderRadius={"8px"}
      >
        <Text>{`${isPie ? payload[0].name : label} : ${payload[0].value
          .toFixed(2)
          .replace(".", ",")} kWh`}</Text>
      </Box>
    );
  }
  return null;
};

const renderActiveShape = ({
  cx,
  cy,
  innerRadius,
  outerRadius,
  startAngle,
  endAngle,
}) => {
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10} // Slightly larger radius for active slice
        startAngle={startAngle}
        endAngle={endAngle}
        fill="#8669FF" // Custom fill for active slice
      />
    </g>
  );
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  name,
  value,
}) => {
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 1.12;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <g>
      <text
        fill="black"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        <tspan x={x} y={y - 20}>
          {name}
        </tspan>
        <tspan x={x} y={y}>
          ({(percent * 100).toFixed(0)}%)
        </tspan>
      </text>
    </g>
  );
};

function Dashbord(props) {
  const { fileData, setFileData, setHeader } = props;
  const [applianceActiveIndex, setApplianceActiveIndex] = useState(0);
  const [roomActiveIndex, setRoomActiveIndex] = useState(0);

  const handleApplianceActiveIndex = (_, index) => {
    setApplianceActiveIndex(index);
  };
  const handleRoomActiveIndex = (_, index) => {
    setRoomActiveIndex(index);
  };

  const [insghtData, setInsightData] = useState([]);

  const [monthlyEnergy, setMonthlyEnergy] = useState({});
  const [weeklyEnergy, setWeeklyEnergy] = useState([]);

  const [estimatedBills, setEstimatedBills] = useState(0);
  const [estimateUsingAVG, setEstimateUsingAVG] = useState(false);

  const [appliances, setAppliances] = useState([]);
  const [weeklyAppliances, setWeeklyAppliances] = useState([]);
  const [totalApplianceEnergy, setTotalApplianceEnergy] = useState("");

  const [applianceStats, setApplianceStats] = useState([]);
  const [roomStats, setRoomStats] = useState([]);

  useEffect(() => {
    let dataMonthly = {};

    let listAppliance = [];
    let seenApplianceMonthly = {};

    MONTHS.forEach((month, monthIndex) => {
      dataMonthly[month] = {
        weekly_consumption: [
          { week: "Week 1", total_energy: 0 },
          { week: "Week 2", total_energy: 0 },
          { week: "Week 3", total_energy: 0 },
          { week: "Week 4", total_energy: 0 },
        ],
        appliance_consumption: {
          // Aircon: {
          //   data: [
          //     { week: "Week 1", total_energy: 0 },
          //     { week: "Week 2", total_energy: 0 },
          //     { week: "Week 3", total_energy: 0 },
          //     { week: "Week 4", total_energy: 0 },
          //   ],
          //   total_energy: 0,
          // },
        },
        weekly_total: 0,
      };

      let seenApplianceWeekly = {};

      for (const data of fileData) {
        const DATE = data.date.split("-");
        const DATE_MONTH = parseInt(DATE[1], 10) - 1;
        const DATE_DAY = DATE[2];

        if (DATE_MONTH !== monthIndex) {
          continue;
        }

        let week = 1;
        if (DATE_DAY >= 22) {
          week = 4;
        } else if (DATE_DAY >= 15) {
          week = 3;
        } else if (DATE_DAY >= 8) {
          week = 2;
        }

        dataMonthly[month].weekly_total += data.energy_consumption;
        dataMonthly[month].weekly_consumption[week - 1].total_energy +=
          data.energy_consumption;

        if (!seenApplianceMonthly[data.appliance]) {
          seenApplianceMonthly[data.appliance] = true;
          listAppliance.push(data.appliance);
        }

        if (!seenApplianceWeekly[data.appliance]) {
          seenApplianceWeekly[data.appliance] = true;
          dataMonthly[month].appliance_consumption[data.appliance] = {
            data: [
              { week: "Week 1", total_energy: 0 },
              { week: "Week 2", total_energy: 0 },
              { week: "Week 3", total_energy: 0 },
              { week: "Week 4", total_energy: 0 },
            ],
            total_energy: 0,
          };
        }

        dataMonthly[month].appliance_consumption[data.appliance].data[
          week - 1
        ].total_energy += data.energy_consumption;
        dataMonthly[month].appliance_consumption[data.appliance].total_energy +=
          data.energy_consumption;
      }
    });

    setMonthlyEnergy(dataMonthly);
    setWeeklyEnergy(dataMonthly[MONTHS[0]].weekly_consumption);
    setEstimatedBills(dataMonthly[MONTHS[0]].weekly_total * tariff);
    setAppliances(listAppliance);
    setWeeklyAppliances(
      dataMonthly[MONTHS[0]].appliance_consumption["Air Conditioner"].data
    );
    setTotalApplianceEnergy(
      dataMonthly[MONTHS[0]].appliance_consumption[
        "Air Conditioner"
      ].total_energy
        .toFixed(2)
        .replace(".", ",")
    );

    handleInsight(dataMonthly, listAppliance);
    // eslint-disable-next-line
  }, []);

  const handleInsight = (dataMonthly, listAppliance) => {
    let sumApplianceTotal = {};

    for (const month of MONTHS) {
      if (dataMonthly[month].weekly_total === 0) {
        break;
      }

      for (const appliance of listAppliance) {
        if (!sumApplianceTotal[appliance]) {
          sumApplianceTotal[appliance] = 0;
        }

        sumApplianceTotal[appliance] +=
          dataMonthly[month].appliance_consumption[appliance].total_energy;
      }
    }

    let mostConsumer = "";
    let applianceStats = [];

    for (const appliance in sumApplianceTotal) {
      applianceStats.push({
        name: appliance,
        total_energy: sumApplianceTotal[appliance],
      });

      if (mostConsumer === "") {
        mostConsumer = appliance;
        continue;
      }

      if (sumApplianceTotal[mostConsumer] < sumApplianceTotal[appliance]) {
        mostConsumer = appliance;
      }
    }

    setApplianceStats(applianceStats);

    let sumApplianceUsage = {};
    let sumRoomEnergyUsage = {};
    let tempPhantomConsumer = {};

    for (const data of fileData) {
      if (!sumApplianceUsage[data.appliance]) {
        sumApplianceUsage[data.appliance] = 0;
      }

      if (!sumRoomEnergyUsage[data.room]) {
        sumRoomEnergyUsage[data.room] = 0;
      }

      if (data.status === "Off" && data.energy_consumption > 0) {
        tempPhantomConsumer[data.appliance] = data.energy_consumption;
      }

      if (
        tempPhantomConsumer[data.appliance] &&
        data.status === "On" &&
        data.energy_consumption > tempPhantomConsumer[data.appliance]
      ) {
        delete tempPhantomConsumer[data.appliance];
      }

      sumApplianceUsage[data.appliance] += 1;
      sumRoomEnergyUsage[data.room] += data.energy_consumption;
    }

    let phantomConsumer = [];
    for (const appliance in tempPhantomConsumer) {
      phantomConsumer.push(appliance);
    }

    let mostUsedAppliance = "";
    for (const appliance in sumApplianceUsage) {
      if (mostUsedAppliance === "") {
        mostUsedAppliance = appliance;
        continue;
      }

      if (sumApplianceUsage[mostUsedAppliance] < sumApplianceUsage[appliance]) {
        mostUsedAppliance = appliance;
      }
    }

    let topEnergyRoom = "";
    let roomStats = [];
    for (const room in sumRoomEnergyUsage) {
      roomStats.push({
        name: room,
        total_energy: sumRoomEnergyUsage[room],
      });

      if (topEnergyRoom === "") {
        topEnergyRoom = room;
        continue;
      }

      if (sumRoomEnergyUsage[topEnergyRoom] < sumRoomEnergyUsage[room]) {
        topEnergyRoom = room;
      }
    }

    setRoomStats(roomStats);

    setInsightData([
      mostConsumer,
      mostUsedAppliance,
      phantomConsumer,
      topEnergyRoom,
    ]);

    let header = [];

    for (const key in fileData[0]) {
      header.push(key);
    }

    setHeader(header);
  };

  const handdleBills = () => {
    if (monthlyEnergy[selectedMonth].weekly_total !== 0) {
      setEstimatedBills(monthlyEnergy[selectedMonth].weekly_total * tariff);
      setEstimateUsingAVG(false);
    } else {
      let sum = 0;
      let countData = 0;

      for (const month in monthlyEnergy) {
        if (month === selectedMonth) {
          break;
        }

        if (monthlyEnergy[month].weekly_total !== 0) {
          sum += monthlyEnergy[month].weekly_total;
          countData++;
        }
      }

      const AVG = sum / countData;
      setEstimatedBills(AVG * tariff);
      setEstimateUsingAVG(true);
    }
  };

  const handleWeeklyAppliance = () => {
    if (
      monthlyEnergy[selectedMonth].appliance_consumption[selectedAppliance] ===
      undefined
    ) {
      setWeeklyAppliances([
        { week: "Week 1", total_energy: 0 },
        { week: "Week 2", total_energy: 0 },
        { week: "Week 3", total_energy: 0 },
        { week: "Week 4", total_energy: 0 },
      ]);

      let sum = 0;
      let countData = 0;

      for (const month in monthlyEnergy) {
        if (
          month === selectedMonth ||
          monthlyEnergy[month].weekly_total === 0
        ) {
          break;
        }

        sum +=
          monthlyEnergy[month].appliance_consumption[selectedAppliance]
            .total_energy;
        countData++;
      }

      const AVG = sum / countData;

      setTotalApplianceEnergy(AVG.toFixed(2).replace(".", ","));
    } else {
      setWeeklyAppliances(
        monthlyEnergy[selectedMonth].appliance_consumption[selectedAppliance]
          .data
      );
      setTotalApplianceEnergy(
        monthlyEnergy[selectedMonth].appliance_consumption[
          selectedAppliance
        ].total_energy
          .toFixed(2)
          .replace(".", ",")
      );
    }
  };

  const handleEnergyMonthChange = (e) => {
    selectedMonth = e.target.value;
    setWeeklyEnergy(monthlyEnergy[selectedMonth].weekly_consumption);
    handdleBills();

    handleWeeklyAppliance();
  };

  const handleCurrentsChange = (e) => {
    tariff = e.target.value;

    handdleBills();
  };

  const handleApplianceChange = (e) => {
    selectedAppliance = e.target.value;
    handleWeeklyAppliance();
  };

  return (
    <Flex direction={"column"} h={"100vh"}>
      <Header setFileData={setFileData} />
      <Grid
        templateColumns="repeat(2, 1fr)"
        px={40}
        py={8}
        pt={"100px"}
        gap={"20px"}
      >
        <GridItem colSpan={2}>
          <Grid templateColumns="repeat(4, 1fr)" gap={"20px"} h={"60"}>
            <Flex
              flexDir={"column"}
              alignItems={"center"}
              p={"24px"}
              border={"4px solid #EAEAEA"}
              borderRadius={"14px"}
              bgColor={"#FCFCFC"}
              shadow={"0px 0px 50px 5px rgba(0,0,0,0.1)"}
            >
              <Flex alignItems={"center"} gap={"8px"}>
                <Heading fontSize={"xl"}>Top Electricity Consumer</Heading>
                <ChakraTooltip
                  label="The appliance that consumed the highest amount of electricity during the monitoring period."
                  fontSize="md"
                >
                  <span>
                    <FiInfo />
                  </span>
                </ChakraTooltip>
              </Flex>
              <Center flexGrow={1}>
                <Heading
                  fontSize={"5xl"}
                  fontWeight={"light"}
                  textAlign={"center"}
                >
                  {insghtData[0]}
                </Heading>
              </Center>
            </Flex>

            <Flex
              flexDir={"column"}
              alignItems={"center"}
              p={"24px"}
              border={"4px solid #EAEAEA"}
              borderRadius={"14px"}
              bgColor={"#FCFCFC"}
              shadow={"0px 0px 50px 5px rgba(0,0,0,0.1)"}
            >
              <Flex alignItems={"center"} gap={"8px"}>
                <Heading fontSize={"xl"}>Most Use Appliance</Heading>
                <ChakraTooltip
                  label="Appliances that are turned on or off the most."
                  fontSize="md"
                >
                  <span>
                    <FiInfo />
                  </span>
                </ChakraTooltip>
              </Flex>
              <Center flexGrow={1}>
                <Heading
                  fontSize={"5xl"}
                  fontWeight={"light"}
                  textAlign={"center"}
                >
                  {insghtData[1]}
                </Heading>
              </Center>
            </Flex>
            <Flex
              flexDir={"column"}
              alignItems={"center"}
              p={"24px"}
              border={"4px solid #EAEAEA"}
              borderRadius={"14px"}
              bgColor={"#FCFCFC"}
              shadow={"0px 0px 50px 5px rgba(0,0,0,0.1)"}
            >
              <Flex alignItems={"center"} gap={"8px"}>
                <Heading fontSize={"xl"}>Phantom Power Consumer</Heading>
                <ChakraTooltip
                  label="The appliance that consumed electricity while turned off, using as much or more power as when it was turned on. This behavior may indicate a malfunction or the need for maintenance."
                  fontSize="md"
                >
                  <span>
                    <FiInfo />
                  </span>
                </ChakraTooltip>
              </Flex>
              <Center flexGrow={1}>
                <Heading
                  fontSize={"5xl"}
                  fontWeight={"light"}
                  textAlign={"center"}
                >
                  {insghtData[2]}
                </Heading>
              </Center>
            </Flex>
            <Flex
              flexDir={"column"}
              alignItems={"center"}
              p={"24px"}
              border={"4px solid #EAEAEA"}
              borderRadius={"14px"}
              bgColor={"#FCFCFC"}
              shadow={"0px 0px 50px 5px rgba(0,0,0,0.1)"}
            >
              <Flex alignItems={"center"} gap={"8px"}>
                <Heading fontSize={"xl"}>Top Energy-Consuming Room</Heading>
                <ChakraTooltip
                  label="The room that consumed the highest amount of electricity during the monitoring period."
                  fontSize="md"
                >
                  <span>
                    <FiInfo />
                  </span>
                </ChakraTooltip>
              </Flex>
              <Center flexGrow={1}>
                <Heading
                  fontSize={"5xl"}
                  fontWeight={"light"}
                  textAlign={"center"}
                >
                  {insghtData[3]}
                </Heading>
              </Center>
            </Flex>
          </Grid>
        </GridItem>
        <Flex
          flexDir={"column"}
          gap={"20px"}
          p={"24px"}
          border={"4px solid #EAEAEA"}
          borderRadius={"14px"}
          bgColor={"#FCFCFC"}
          shadow={"0px 0px 50px 5px rgba(0,0,0,0.1)"}
        >
          <Heading fontSize={"2xl"}>
            Energy Consumption Breakdown by Appliance
          </Heading>

          <Center h={"40vh"} flexDir={"column"}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart
                width={400}
                height={400}
                // margin={{ top: 50, bottom: 0 }}
              >
                <Pie
                  data={applianceStats}
                  dataKey="total_energy"
                  stroke="#8669FF"
                  fill="#E4EEFF"
                  label={renderCustomizedLabel}
                  cx="50%"
                  cy="53%"
                  activeIndex={applianceActiveIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={handleApplianceActiveIndex}
                />
                <Tooltip content={<CustomTooltip isPie />} />
              </PieChart>
            </ResponsiveContainer>
          </Center>
        </Flex>
        <Flex
          flexDir={"column"}
          gap={"20px"}
          p={"24px"}
          border={"4px solid #EAEAEA"}
          borderRadius={"14px"}
          bgColor={"#FCFCFC"}
          shadow={"0px 0px 50px 5px rgba(0,0,0,0.1)"}
        >
          <Heading fontSize={"2xl"}>
            Energy Consumption Breakdown by Room
          </Heading>

          <Center h={"40vh"} flexDir={"column"}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart
                width={400}
                height={400}
                // margin={{ top: 50, bottom: 0 }}
              >
                <Pie
                  data={roomStats}
                  dataKey="total_energy"
                  stroke="#8669FF"
                  fill="#E4EEFF"
                  label={renderCustomizedLabel}
                  cx="50%"
                  cy="53%"
                  activeIndex={roomActiveIndex}
                  activeShape={renderActiveShape}
                  onMouseEnter={handleRoomActiveIndex}
                />
                <Tooltip content={<CustomTooltip isPie />} />
              </PieChart>
            </ResponsiveContainer>
          </Center>
        </Flex>
        <GridItem colSpan={2}>
          <Flex gap={1} flexDir={"column"}>
            {/* <Heading whiteSpace={"nowrap"}>Month:</Heading>
              <Select
                variant="unstyled"
                display={"inline"}
                w={"fit-content"}
                fontWeight={"semibold"}
                // color={"brand.primary"}
                onChange={handleEnergyMonthChange}
              >
                {MONTHS.map((month, index) => (
                  <option key={index} value={month}>
                    {month}
                  </option>
                ))}
              </Select> */}
            <Text>Select Periode</Text>
            <Select
              fontWeight={"semibold"}
              // color={"brand.primary"}
              onChange={handleEnergyMonthChange}
            >
              {MONTHS.map((month, index) => (
                <option key={index} value={month}>
                  {month}
                </option>
              ))}
            </Select>
          </Flex>
        </GridItem>
        <Flex
          flexDir={"column"}
          gap={"40px"}
          p={"24px"}
          border={"4px solid #EAEAEA"}
          borderRadius={"14px"}
          bgColor={"#FCFCFC"}
          shadow={"0px 0px 50px 5px rgba(0,0,0,0.1)"}
        >
          <Flex>
            <Box>
              <Heading fontSize={"2xl"}>Weekly Energy Consumption</Heading>
              <Text fontSize={"xl"}>
                Estimated bills:{" "}
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(estimatedBills)}
                {estimateUsingAVG && "*"}
              </Text>
            </Box>
            <Spacer />
            <Flex justifyContent={"end"} flexDir={"column"}>
              <Center gap={1}>
                <Text whiteSpace={"nowrap"}>Currents:</Text>
                <Select
                  variant="unstyled"
                  display={"inline"}
                  w={"fit-content"}
                  fontWeight={"semibold"}
                  // color={"brand.primary"}
                  onChange={handleCurrentsChange}
                >
                  {tariffByCurrents.map((item, index) => (
                    <option key={index} value={item.tarrif}>
                      {item.current}
                    </option>
                  ))}
                </Select>
              </Center>
            </Flex>
          </Flex>
          <Center h={"40vh"} flexDir={"column"}>
            {estimateUsingAVG && (
              <Text>
                *Estimated bills are calculated based on historical data and can
                be inaccurate.
              </Text>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart width={500} height={400} data={weeklyEnergy}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="total_energy"
                  stroke="#8669FF"
                  fill="#E4EEFF"
                  minPointSize={10}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Center>
        </Flex>
        <Flex
          flexDir={"column"}
          gap={"40px"}
          p={"24px"}
          border={"4px solid #EAEAEA"}
          borderRadius={"14px"}
          bgColor={"#FCFCFC"}
          shadow={"0px 0px 50px 5px rgba(0,0,0,0.1)"}
        >
          <Flex>
            <Box>
              <Heading fontSize={"2xl"}>Appliance Energy Consumption</Heading>
              <Text fontSize={"xl"}>
                Total energy: {totalApplianceEnergy} kWh
                {estimateUsingAVG && "*"}
              </Text>
            </Box>
            <Spacer />
            <Flex flexDir={"column"} justifyContent={"end"}>
              <Center gap={1}>
                <Text whiteSpace={"nowrap"}>Appliance:</Text>
                <Select
                  variant="unstyled"
                  display={"inline"}
                  w={"fit-content"}
                  fontWeight={"semibold"}
                  // color={"brand.primary"}
                  onChange={handleApplianceChange}
                >
                  {appliances.map((appliance, index) => (
                    <option key={index} value={appliance}>
                      {appliance}
                    </option>
                  ))}
                </Select>
              </Center>
            </Flex>
          </Flex>
          <Center h={"40vh"} flexDir={"column"}>
            {estimateUsingAVG && (
              <Text>
                *Total energy are calculated based on historical data and can be
                inaccurate.
              </Text>
            )}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart width={500} height={400} data={weeklyAppliances}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "transparent" }}
                />
                <Bar
                  type="monotone"
                  dataKey="total_energy"
                  stroke="#8669FF"
                  fill="#E4EEFF"
                  minPointSize={10}
                  activeBar={<Rectangle fill="#8669FF" />}
                />
              </BarChart>
            </ResponsiveContainer>
          </Center>
        </Flex>
      </Grid>
    </Flex>
  );
}

export default Dashbord;

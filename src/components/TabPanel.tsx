import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import KeyboardFAB from "./KeyboardFAB";
import Configurator from "./Configurator";
import { AtyuConfigProvider } from "../controllers/context/atyuContext";
import styled from "@emotion/styled";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const FixedTabs = styled(Tabs)`
  height: 100%;
  position: fixed;
`;

const TabPanelContainer = styled.div`
  padding-left: 100px;
  margin-bottom: 100px;
	height: calc(100vh - 104px);
	width: 1000px;
	margin: auto;
`;

const TabPanelContent = styled(Box)`
	width: 100%;
`;

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <TabPanelContainer
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      {...other}
    >
      {value === index && <TabPanelContent sx={{ pt: 2, pl: 4, pr: 4, pb: 12 }}>{children}</TabPanelContent>}
    </TabPanelContainer>
  );
}

export default function VerticalTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ display: "flex", marginTop: "100px", overflowY: "scroll" }}>
      <FixedTabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        sx={{ borderRight: 1, borderColor: "divider", m: "auto 2px" }}
      >
        <Tab label="Home" />
        <Tab label="Settings" />
      </FixedTabs>
      <TabPanel value={value} index={0}>
        <AtyuConfigProvider>
          <Box>
            <KeyboardFAB />
            <Configurator />
          </Box>
        </AtyuConfigProvider>
      </TabPanel>
      <TabPanel value={value} index={1}>
        TODO settings
      </TabPanel>
    </Box>
  );
}

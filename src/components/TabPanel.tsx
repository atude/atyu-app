import React, { useEffect, useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import KeyboardFAB from "./KeyboardFAB";
import Configurator from "../pages/Configurator";
import { AtyuConfigProvider } from "../controllers/context/atyuContext";
import styled from "@emotion/styled";
import { useAppContext } from "../controllers/context/appContext";
import { Button, CircularProgress, Tooltip, Typography } from "@mui/material";
import runVerify from "../functions/commands/runVerify";
import { AppReadyState } from "../constants/types/appReadyState";
import runSetup from "../functions/commands/runSetup";
import { HelpOutline } from "@mui/icons-material";
import { setupHelpText } from "../constants";
import HorizontalBox from "./HorizontalBox";
import Settings from "../pages/Settings";

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

const SetupBox = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
  margin-top: 100px;
  max-width: 400px;
  text-align: center;
`;

const BigLoading = styled(CircularProgress)`
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 24px;
`;

// const AtyuImage = styled.img`
// 	position: absolute;
// 	bottom: 0;
// 	left: 0;
// 	width: 48px;
// 	height: 48px;
// 	padding: 2px;
// 	margin-bottom: 28px;
// 	margin-left: 28px;
// `;

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <TabPanelContainer
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <TabPanelContent sx={{ pt: 2, pl: 4, pr: 4, pb: 12 }}>{children}</TabPanelContent>
      )}
    </TabPanelContainer>
  );
}

export default function VerticalTabs() {
  const appContext = useAppContext();
	const { appReadyState } = appContext;
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  useEffect(() => {
		runVerify(appContext);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box sx={{ display: "flex", marginTop: "100px", overflowY: "scroll" }}>
      {appReadyState === AppReadyState.LOADING && <BigLoading />}
      {appReadyState === AppReadyState.NOT_READY && (
        <SetupBox>
          <HorizontalBox sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ mr: 1 }}>
              Couldn't load Atyu QMK files
            </Typography>
            <Tooltip title={setupHelpText} arrow leaveDelay={200}>
              <HelpOutline color="disabled" />
            </Tooltip>
          </HorizontalBox>
          <Button variant="contained" onClick={() => runSetup(appContext)}>
            Run setup
          </Button>
        </SetupBox>
      )}
      {appReadyState === AppReadyState.READY && (
        <AtyuConfigProvider>
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
            <Box>
              <KeyboardFAB />
              <Configurator />
            </Box>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Settings />
          </TabPanel>
        </AtyuConfigProvider>
      )}
			{/* <AtyuImage src="/in_app_icon.png" alt="atyu icon" /> */}
    </Box>
  );
}

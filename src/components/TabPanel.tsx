import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import KeyboardSelector from './KeyboardFAB';
import Configurator from './Configurator';
import { AtyuConfigProvider } from '../controllers/context/atyuContext';
import styled from '@emotion/styled';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const FixedTabs = styled(Tabs)`
	height: 100%;
	position: fixed;
`;

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      style={{ width: "100%", marginLeft: "100px", marginBottom: "100px" }}
			{...other}
    >
      {value === index && (
        <Box sx={{ pt: 2, pl: 4, pr: 4 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function VerticalTabs() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ display: "flex", marginTop: "100px" }}>
      <FixedTabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        sx={{ borderRight: 1, borderColor: "divider", }}
      >
        <Tab label="Home" />
        <Tab label="Settings" />
      </FixedTabs>
      <TabPanel value={value} index={0}>
				<Box>
					<KeyboardSelector />
					<AtyuConfigProvider>
						<Configurator />
					</AtyuConfigProvider>
				</Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        TODO settings
      </TabPanel>
    </Box>
  );
}

import React, { useContext, useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { AppContext } from '../context';
import { keyboardsMap } from '../configs/keyboards';
import KeyboardSelector from './KeyboardFAB';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`vertical-tabpanel-${index}`}
      style={{ height: "100%", width: "100%" }}
			{...other}
    >
      {value === index && (
        <Box sx={{ p: 5 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function VerticalTabs() {
  const [value, setValue] = useState(0);
	const appContext = useContext(AppContext);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Tabs
        orientation="vertical"
        variant="scrollable"
        value={value}
        onChange={handleChange}
        sx={{ borderRight: 1, borderColor: "divider", height: "100%" }}
      >
        <Tab label="Home" />
        <Tab label="Settings" />
      </Tabs>
      <TabPanel value={value} index={0}>
				<Box>
					<KeyboardSelector />
					{keyboardsMap[appContext.keyboard].home}
				</Box>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
    </Box>
  );
}

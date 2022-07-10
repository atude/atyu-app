import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from "@mui/material/CssBaseline";
import { useState } from "react";
import { AppContext } from './context';
import { defaultKeyboard } from './configs/keyboards';
import TabPanel from './components/TabPanel';
import { FlashState } from './consts';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => {
	const [keyboard, setKeyboard] = useState<string>(defaultKeyboard);
	const [flashState, setFlashState] = useState<FlashState>(FlashState.IDLE);

  return (
    <ThemeProvider theme={darkTheme}>
			<AppContext.Provider value={{ keyboard, setKeyboard, flashState, setFlashState }}>
				<CssBaseline />
				<TabPanel />
			</AppContext.Provider>
    </ThemeProvider>
  );
}

export default App;

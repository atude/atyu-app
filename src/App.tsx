import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppProvider } from "./controllers/context/appContext";
import TabPanel from "./components/TabPanel";
import FlashAlert from "./components/FlashAlert";
import { colors } from "@mui/material";
import { AppStoreProvider } from "./controllers/context/appStoreContext";

const theme = createTheme({
  palette: {
    mode: "dark",
		secondary: {
			main: colors.deepOrange[400],
		},
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
			<AppStoreProvider>
				<AppProvider>
					<CssBaseline />
					<FlashAlert />
					<TabPanel />
				</AppProvider>
			</AppStoreProvider>
    </ThemeProvider>
  );
};

export default App;

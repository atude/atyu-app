import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppProvider } from "./controllers/context/appContext";
import TabPanel from "./components/TabPanel";
import FlashAlert from "./components/FlashAlert";
import { colors } from "@mui/material";

const theme = createTheme({
  palette: {
    mode: "dark",
		secondary: {
			main: colors.pink[300]
		},
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppProvider>
        <CssBaseline />
        <FlashAlert />
        <TabPanel />
			</AppProvider>
    </ThemeProvider>
  );
};

export default App;

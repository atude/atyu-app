import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AppProvider } from "./controllers/context/appContext";
import TabPanel from "./components/TabPanel";
import FlashAlert from "./components/FlashAlert";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <AppProvider>
        <CssBaseline />
        <FlashAlert />
        <TabPanel />
			</AppProvider>
    </ThemeProvider>
  );
};

export default App;

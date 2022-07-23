import { Box, Button, Switch, Typography } from "@mui/material";
import HorizontalBox from "../components/HorizontalBox";
import { useAppContext } from "../controllers/context/appContext";
import { useAppStoreContext } from "../controllers/context/appStoreContext";
import runSetup from "../functions/commands/runSetup";
import runSync from "../functions/commands/runSync";

type SettingsItemProps = {
  heading: string;
  desc?: string;
  action?: React.ReactNode;
};

const SettingsItem = (props: SettingsItemProps) => {
  const { heading, desc, action } = props;
  return (
    <HorizontalBox sx={{ mb: 4, flexWrap: "wrap" }} expanded>
      <Box sx={{ maxWidth: "60%" }}>
        <Typography color="primary">{heading}</Typography>
        <Typography variant="body2">{desc}</Typography>
      </Box>
      {action}
    </HorizontalBox>
  );
};

const Settings = () => {
  const appContext = useAppContext();
	const { enableFirmwareSizeCheck, toggleEnableFirmwareSizeCheck } = useAppStoreContext();
  const handleSync = () => runSync(appContext);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <Button variant="contained" sx={{ mb: 4 }} onClick={handleSync}>
        Fetch Atyu QMK updates
      </Button>
      <SettingsItem
        heading="Enable firmware size check"
        desc={`
					Checks firmware size is safe to install to your keyboard. Disabling this can brick your 
					keyboard and require a hard reset.
				`.trim()}
        action={
          <Switch checked={enableFirmwareSizeCheck} onChange={toggleEnableFirmwareSizeCheck} />
        }
      />
      <SettingsItem
        heading="Run fresh Atyu QMK install"
        desc="Had a little too much fun in the Atyu QMK folder? Do a fresh install."
        action={
          <Button variant="contained" onClick={() => runSetup(appContext)}>
            Rerun setup
          </Button>
        }
      />
    </Box>
  );
};

export default Settings;

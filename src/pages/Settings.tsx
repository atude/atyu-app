import { Box, Button, Typography } from "@mui/material";
import HorizontalBox from "../components/HorizontalBox";
import { useAppContext } from "../controllers/context/appContext";
import runSetup from "../functions/commands/runSetup";
import runSync from "../functions/commands/runSync";

type SettingsItemProps = {
	heading: string;
	desc?: string;
	action?: React.ReactNode;
}

const SettingsItem = (props: SettingsItemProps) => {
	const { heading, desc, action } = props;
	return (
		<HorizontalBox expanded>
			<Box>
				<Typography color="primary">{heading}</Typography>
				<Typography variant="body2">{desc}</Typography>
			</Box>
			{action}
		</HorizontalBox>
	);
};

const Settings = () => {
	const appContext = useAppContext();
	const handleSync = () => runSync(appContext);

	return (
		<Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
			<Button variant="contained" sx={{ mb: 4 }} onClick={handleSync}>Fetch Atyu QMK updates</Button>
			<SettingsItem
				heading="Run fresh Atyu QMK install"
				desc="Had a little too much fun in the Atyu QMK folder? Do a fresh install"
				action={<Button variant="contained" onClick={() => runSetup(appContext)}>Rerun setup</Button>}
			/>
		</Box>
	)
};

export default Settings;
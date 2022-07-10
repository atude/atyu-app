import { AccessTime, Gif, ViewComfyRounded } from "@mui/icons-material";
import { Box } from "@mui/material";
import OledModeContainer from "../../components/OledModeContainer";
import { OledMode } from "../../consts";
import { useSatisfaction75 } from "./context";
import Satisfaction75GifTool from "./modes/Satisfaction75GifTool";

const Satisfaction75 = () => {
	const context = useSatisfaction75();
	const oledModes: OledMode[] = [
		{
			name: "Keyboard Matrix Display",
			component: <></>,
			icon: <ViewComfyRounded />,
		},
		{
			name: "Big Clock Display",
			component: <></>,
			icon: <AccessTime />,
			toggleEnabled: context.toggleBigClockEnabled,
			isEnabled: context.bigClockEnabled,
		},
		{
			name: "Custom GIF",
			component: <></>,
			icon: <Gif />,
			toggleEnabled: context.toggleCustomGifEnabled,
			isEnabled: context.customGifEnabled,
		},
	];

	return (
		<Box>
			<OledModeContainer oledModes={oledModes}  />
			<Satisfaction75GifTool />
		</Box>
	);
};

export default Satisfaction75;
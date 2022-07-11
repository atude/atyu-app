import { AccessTime, Gif, ViewComfyRounded } from "@mui/icons-material";
import { Box, Button } from "@mui/material";
import OledModeContainer from "../../components/OledModeContainer";
import { OledMode } from "../../consts";
import { runCodegen } from "./codegen";
import { useSatisfaction75 } from "./context";
import Satisfaction75GifTool from "./modes/Satisfaction75GifTool";

const Satisfaction75 = () => {
	const context = useSatisfaction75();
	const oledModes: OledMode[] = [
		{
			name: "Keyboard Matrix Display",
			icon: <ViewComfyRounded />,
		},
		{
			name: "Big Clock Display",
			icon: <AccessTime />,
			toggleEnabled: context.toggleBigClockEnabled,
			isEnabled: context.bigClockEnabled,
		},
		{
			name: "Custom GIF",
			component: <Satisfaction75GifTool />,
			icon: <Gif />,
			toggleEnabled: context.toggleCustomGifEnabled,
			isEnabled: context.customGifEnabled,
		},
	];

	return (
		<Box>
			<OledModeContainer oledModes={oledModes}  />
			<Button onClick={() => console.log(runCodegen(context))}>codegen test</Button>
		</Box>
	);
};

export default Satisfaction75;
import { keyboardsMap } from "../configs/keyboards";
import { FlashState } from "../constants/types/flashState";
const { spawn } = window.require("child_process");

const calcFlashProgress = (dataString: string): number => {
	const flashNumber = dataString.match(/\d+?%/);
	if (flashNumber?.length) {
		return Number(flashNumber[0].replace("%", ""));
	}

	return 0;
}

// Codegen and patch firmware
export const runPatch = () => {

;}

// Codegen, patch and install to kb
export const runFlash = (
	keyboardKey: string, 
	setFlashState: React.Dispatch<React.SetStateAction<FlashState>>,
	setFlashProgress: React.Dispatch<React.SetStateAction<number>>
) => {
  const keyboardConfig = keyboardsMap[keyboardKey];
  if (!keyboardConfig) {
    // TODO: error out here
		setFlashState(FlashState.ERROR);
		return;
  }
	const { qmkKb, qmkKm } = keyboardConfig;

	// TODO: patch changes into firmware

	// Run qmk flash
	setFlashState(FlashState.COMPILING);
	const child = spawn("qmk", ["flash", "-kb", qmkKb, "-km", qmkKm], {
		/* TODO: set working dir 
		cwd: "test",
		*/
	});

	// Update state as log changes
	child.stdout.on("data", (data: any) => {
		const dataString: string = data.toString();
		console.log(dataString);
		if (dataString === ".") {
			setFlashState(FlashState.WAITING_FOR_DFU);
		} else if (dataString.includes("Erase") && dataString.includes("%")) {
			setFlashState(FlashState.FLASHING_ERASING);
			setFlashProgress(calcFlashProgress(dataString));
		} else if (dataString.includes("Download") && dataString.includes("%")) {
			setFlashState(FlashState.FLASHING_DOWNLOADING);
			setFlashProgress(calcFlashProgress(dataString));
		}
	});

	child.stderr.on("data", function (data: any) {
		console.log(data.toString());
	});

	child.on("close", function (code: any) {
		console.log("Finished with code " + code);
		if (Number(code) === 0) {
			setFlashState(FlashState.DONE);
		} else {
			setFlashState(FlashState.ERROR);
			return;
		}
	});
};

import { keyboardsMap } from "../configs/keyboards";
import { FlashState } from "../consts";
const { spawn } = window.require("child_process");

// Install to kb
export const runFlash = (
	keyboardKey: string, 
	setFlashState: React.Dispatch<React.SetStateAction<FlashState>>
) => {
  const keyboardConfig = keyboardsMap[keyboardKey];
  if (!keyboardConfig) {
    // TODO: error out here
		setFlashState(FlashState.ERROR);
		return;
  }

	// Run qmk flash
	setFlashState(FlashState.COMPILING);
	const child = spawn("qmk", ["flash", "-kb", keyboardConfig.qmkKb, "-km", keyboardConfig.qmkKm]);

	child.stdout.on("data", (data: any) => {
		console.log(data.toString());
		if (data.toString() === ".") {
			setFlashState(FlashState.WAITING_FOR_DFU);
		} else if (data.toString().includes("Downloading element to address")) {
			setFlashState(FlashState.FLASHING);
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

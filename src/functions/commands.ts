import { keyboardsMap } from "../configs/keyboards";
import { atyuConfigFilename } from "../constants";
import { FlashState } from "../constants/types/flashState";
import { AtyuContext } from "../controllers/context/atyuContext";
import { runCodegen } from "./codegen";
const shell = window.require("shelljs");
shell.config.execPath = String(shell.which("node"));

const calcFlashProgress = (dataString: string): number => {
  const flashNumber = dataString.match(/\d+?%/);
  if (flashNumber?.length) {
    return Number(flashNumber[0].replace("%", ""));
  }

  return 0;
};

// Codegen, patch and install to kb
export const runFlash = (
  keyboardKey: string,
  context: AtyuContext,
  onlyPatch: boolean,
  setFlashState: React.Dispatch<React.SetStateAction<FlashState>>,
	setFlashMessage: React.Dispatch<React.SetStateAction<string>>,
  setFlashProgress: React.Dispatch<React.SetStateAction<number>>
) => {
  const keyboardConfig = keyboardsMap[keyboardKey];
  if (!keyboardConfig) {
    setFlashState(FlashState.ERROR);
		setFlashMessage("Could not read keyboard config.");
    return;
  }
  const { qmkKb, qmkKm } = keyboardConfig;
  const configCode = runCodegen(context);

	// TODO: get dir properly
  const dir =
    "/Users/atude/Core/projects/qmk_atude/qmk_firmware/keyboards/cannonkeys/satisfaction75";

	setFlashState(FlashState.PATCHING);
	if (shell.cd(dir).code !== 0 || shell.echo(configCode).to(atyuConfigFilename).code !== 0) {
		setFlashState(FlashState.ERROR);
		setFlashMessage("Failed to save changes to QMK.");
		return;
	}

	if (onlyPatch) {
    setFlashState(FlashState.DONE);
    return;
  }

	// Run qmk flash
	setFlashState(FlashState.COMPILING);
  const cmdFlash = shell.exec(`qmk flash -kb ${qmkKb} -km ${qmkKm}`, { async: true });

  // Update state as log changes
  cmdFlash.stdout.on("data", (data: any) => {
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

  cmdFlash.stderr.on("data", (data: any) => {
    console.log(data.toString());
  });

  cmdFlash.on("close", (code: any) => {
    console.log("Finished with code " + code);
    if (Number(code) === 0) {
      setFlashState(FlashState.DONE);
    } else {
      setFlashState(FlashState.ERROR);
			setFlashMessage("An error occured with building and flashing the firmware.");
      return;
    }
  });
};

import { FlashState } from "../../constants/types/flashState";
import { AppContext } from "../../controllers/context/appContext";
import { AtyuContext } from "../../controllers/context/atyuContext";
import { runCodegen } from "../codegen";
import { atyuHConfigFilename, getKeyboardDir } from "../shellHelpers";
import { getShell, killCmd, updateLog } from "./helpers";

const flashCommandState = {
  cancelled: false,
};

const calcFlashProgress = (dataString: string): number => {
  const flashNumber = dataString.match(/\d+?%/);
  return flashNumber?.length ? Number(flashNumber[0].replace("%", "")) : 0;
};

export const cancelFlash = () => flashCommandState.cancelled = true;

// Codegen, patch and install to kb
const runFlash = (
  appContext: AppContext,
  context: AtyuContext,
  onlyPatch: boolean
): void => {
  const { keyboard, keyboardsConfig, setLog, setFlashState, setFlashMessage, setFlashProgress } = appContext;
  const keyboardConfig = keyboardsConfig[keyboard];
  const handleError = (message?: string) => {
    setFlashState(FlashState.ERROR);
    setFlashMessage(message ?? "");
  };
	const shell = getShell();

  if (!keyboardConfig) {
    return handleError("Could not read keyboard config.");
  }

  const { qmkKb, qmkKm } = keyboardConfig;
  const configCode = runCodegen(context);
  const keyboardDir = getKeyboardDir(keyboardConfig.dir);
  console.log("dir: " + keyboardDir);

  // Patch firmware; copy to qmk folder
  setFlashState(FlashState.PATCHING);
  if (
    shell.cd(keyboardDir).code !== 0 ||
    shell.echo(configCode).to(atyuHConfigFilename).code !== 0
  ) {
		updateLog(setLog, `Couldn't save file to ${atyuHConfigFilename}`);
    return handleError("Failed to save changes to Atyu QMK folder");
  }
	updateLog(setLog, "Saved file.");

  // Save only; dont flash to keyboard
  if (onlyPatch) {
    return setFlashState(FlashState.DONE);
  }

  // Run qmk flash
  setFlashState(FlashState.COMPILING);
  const cmdFlash = shell.exec(`qmk flash -kb ${qmkKb} -km ${qmkKm}`, { async: true });

  // Update state as log changes
  cmdFlash.stdout.on("data", (data: any) => {
    const dataString: string = data.toString();
    updateLog(setLog, dataString);
    if (flashCommandState.cancelled) {
      killCmd(cmdFlash);
    }
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

  cmdFlash.stderr.on("data", (data: any) => updateLog(setLog, data.toString()));

  cmdFlash.on("close", (code: any) => {
    updateLog(setLog, `Finished with code ${Number(code)}`);
    if (flashCommandState.cancelled) {
      flashCommandState.cancelled = false;
      return setFlashState(FlashState.CANCELLED);
    }
    return Number(code) === 0
      ? setFlashState(FlashState.DONE)
      : handleError("An error occured with building and flashing the firmware.");
  });
};

export default runFlash;
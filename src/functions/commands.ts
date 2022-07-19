import { keyboardsMap } from "../configs/keyboards";
import { atyuConfigFilename } from "../constants";
import { FlashState } from "../constants/types/flashState";
import { AtyuContext } from "../controllers/context/atyuContext";
import { runCodegen } from "./codegen";
import { getKeyboardDir } from "./generic";

const shell = window.require("shelljs");
shell.config.execPath = String(shell.which("node"));

// TODO: get dir properly
const dir = "/Users/atude/Core/projects/qmk_atude";

const calcFlashProgress = (dataString: string): number => {
  const flashNumber = dataString.match(/\d+?%/);
  return flashNumber?.length ? Number(flashNumber[0].replace("%", "")) : 0;
};

// Codegen, patch and install to kb
export const runFlash = (
  keyboardKey: string,
  context: AtyuContext,
	log: string[],
  onlyPatch: boolean,
  setFlashState: React.Dispatch<React.SetStateAction<FlashState>>,
  setFlashMessage: React.Dispatch<React.SetStateAction<string>>,
  setFlashProgress: React.Dispatch<React.SetStateAction<number>>,
	setLog: React.Dispatch<React.SetStateAction<string[]>>,
): void => {
  const keyboardConfig = keyboardsMap[keyboardKey];
  const handleError = (message?: string) => {
    setFlashState(FlashState.ERROR);
    setFlashMessage(message ?? "");
  };

	const updateLog = (dataString: string) => {
		// Add log in reverse order for printing purposes
		setLog((existingLog) => [dataString, ...existingLog,]);
		console.log(dataString);
	};

  if (!keyboardConfig) {
    return handleError("Could not read keyboard config.");
  }

  const { qmkKb, qmkKm } = keyboardConfig;
  const configCode = runCodegen(context);
  const keyboardDir = getKeyboardDir(dir, keyboardConfig.dir);
  console.log("dir: " + keyboardDir);

	// Patch firmware; copy to qmk folder
  setFlashState(FlashState.PATCHING);
  if (
    shell.cd(keyboardDir).code !== 0 ||
    shell.echo(configCode).to(atyuConfigFilename).code !== 0
  ) {
    return handleError("Failed to save changes to QMK.");
  }

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
		updateLog(dataString);
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
    updateLog(data.toString());
  });

  cmdFlash.on("close", (code: any) => {
    updateLog(`Finished with code ${Number(code)}`);
    return Number(code) === 0
      ? setFlashState(FlashState.DONE)
      : handleError("An error occured with building and flashing the firmware.");
  });
};

// First time setup
export const runSetup = () => {};

// Pull updates from repo
export const runSync = () => {};

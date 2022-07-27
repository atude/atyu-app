import { FlashState } from "../../constants/types/flashState";
import { AppContext } from "../../controllers/context/appContext";
import { appStore } from "../../controllers/context/appStoreContext";
import { AtyuContext } from "../../controllers/context/atyuContext";
import { runCodegen } from "../codegen";
import { atyuHConfigFilename, getKeyboardDir } from "../path";
import shell, { shellExecOptions, killAsyncCmd, updateLog, shellRun } from "./shell";

const flashCommandState = {
  cancelled: false,
};

const calcFlashProgress = (dataString: string): number => {
  const flashNumber = dataString.match(/\d+?%/);
  return flashNumber?.length ? Number(flashNumber[0].replace("%", "")) : 0;
};

const attemptParseFirmwareSize = (dataString: string): undefined | number => {
  try {
    const matches = dataString.match(/\b(\d+)\b/g);
    if (matches?.length === 4) {
      // Probably includes the firmware size here; get the "data" value
      const size = Number(matches[1]);
      if (size && size > 0) {
        return size;
      }
    }
  } catch (e) {
    return undefined;
  }
  return undefined;
};

export const cancelFlash = () => (flashCommandState.cancelled = true);

// Codegen, patch and install to kb
const runFlash = async (
  appContext: AppContext,
  context: AtyuContext,
  onlyPatch: boolean
): Promise<void> => {
  const { keyboard, keyboardsConfig, setLog, setFlashState, setFlashProgress } = appContext;
  const keyboardConfig = keyboardsConfig[keyboard];

  if (!keyboardConfig) {
    return setFlashState(FlashState.ERROR, "Could not read keyboard config.");
  }

  const { qmkKb, qmkKm, maxFirmwareSizeBytes } = keyboardConfig;
  const configCode = runCodegen(context);
  const keyboardDir = getKeyboardDir(keyboardConfig.dir);
  console.log("dir: " + keyboardDir);

  // Patch firmware; copy to qmk folder
  setFlashState(FlashState.PATCHING);

  // cd and save file
	// TODO: this config code might need to escape chars like ""
  const runSave = await shellRun(
    `cd ${keyboardDir} && echo "${configCode}" > ${atyuHConfigFilename}`
  );
  if (!runSave.success) {
    updateLog(setLog, `Couldn't save code to ${atyuHConfigFilename}`);
    return setFlashState(FlashState.ERROR, "Failed to save changes to Atyu QMK config");
  }
  updateLog(setLog, "Saved file.");

  // Save only; dont flash to keyboard
  if (onlyPatch) {
    return setFlashState(FlashState.DONE, "Saved config to Atyu QMK");
  }

  // Run qmk flash
  const doFlash = () => {
    setFlashState(FlashState.COMPILING);
    const cmdFlash = shell.exec(
      `cd ${keyboardDir} && qmk flash -kb ${qmkKb} -km ${qmkKm}`,
      shellExecOptions
    );

    // Update state as log changes
    cmdFlash.stdout?.on("data", (data: any) => {
      const dataString: string = data.toString();
      updateLog(setLog, dataString);
      if (flashCommandState.cancelled) {
        killAsyncCmd(cmdFlash);
      }
      if (dataString === ".") {
        setFlashState(FlashState.WAITING_FOR_DFU, "Please press the RESET key on your keyboard");
      } else if (dataString.includes("Erase") && dataString.includes("%")) {
        setFlashState(FlashState.FLASHING_ERASING);
        setFlashProgress(calcFlashProgress(dataString));
      } else if (dataString.includes("Download") && dataString.includes("%")) {
        setFlashState(FlashState.FLASHING_DOWNLOADING);
        setFlashProgress(calcFlashProgress(dataString));
      }
    });

    cmdFlash.stderr?.on("data", (data: any) => updateLog(setLog, data.toString()));

    cmdFlash.on("close", (code: any) => {
      updateLog(setLog, `Finished with code ${Number(code)}`);
      if (flashCommandState.cancelled) {
        flashCommandState.cancelled = false;
        return setFlashState(FlashState.CANCELLED, "Stopped firmware installation");
      }
      return Number(code) === 0
        ? setFlashState(FlashState.DONE, "Successfully installed firmware")
        : setFlashState(
            FlashState.ERROR,
            "An error occured with building and flashing the firmware."
          );
    });
  };

  if (appStore.get("enableFirmwareSizeCheck")) {
    updateLog(setLog, "Precompiling to check firmware size");
    setFlashState(FlashState.CHECK_SIZE);

    let firmwareSize: number = 0;
    let sawSizeAfter: boolean = false;

    // Compile once to check firmware size
    const cmdCompile = shell.exec(`cd ${keyboardDir} && qmk compile -kb ${qmkKb} -km ${qmkKm}`, shellExecOptions);

    // Update state as log changes
    cmdCompile.stdout?.on("data", (data: any) => {
      const dataString: string = data.toString();
      updateLog(setLog, dataString);
      if (firmwareSize > 0) {
        return;
      }
      if (!sawSizeAfter && dataString.includes("Size after")) {
        sawSizeAfter = true;
      }
      if (sawSizeAfter) {
        const attemptedSize = attemptParseFirmwareSize(dataString);
        if (attemptedSize) {
          updateLog(setLog, `Attempted to read size: ${attemptedSize}`);
          firmwareSize = attemptedSize;
        }
      }
    });

    cmdCompile.stderr?.on("data", (data: any) => updateLog(setLog, data.toString()));
    cmdCompile.on("close", (code: any) => {
      updateLog(setLog, `Finished with code ${Number(code)}`);
      if (Number(code) !== 0) {
        return setFlashState(FlashState.ERROR, "An error occured with building the firmware.");
      }
      if (firmwareSize > maxFirmwareSizeBytes) {
        updateLog(setLog, `Firmware size ${firmwareSize} > ${maxFirmwareSizeBytes}`);
        return setFlashState(
          FlashState.CANCELLED,
          `Firmware size is too big (got ${firmwareSize}b, but max is ${maxFirmwareSizeBytes}b) - 
					try using less options`
        );
      }
      return doFlash();
    });
  } else {
    doFlash();
  }
};

export default runFlash;

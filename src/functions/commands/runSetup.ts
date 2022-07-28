import { AppReadyState } from "../../constants/types/appReadyState";
import { FlashState } from "../../constants/types/flashState";
import { AppContext } from "../../controllers/context/appContext";
import { atyuQmkDir } from "../path";
import runVerify from "./runVerify";
import shell, { checkPrereqs, shellExecOptions, shellRun, updateLog } from "./shell";

// First time setup
const runSetup = async (appContext: AppContext): Promise<void> => {
  const { setLog, setFlashState, setFlashMessage, setAppReadyState } = appContext;

  // Check for git and qmk existence
	const hasPrereqs = await checkPrereqs();
  if (!hasPrereqs.success) {
		if (hasPrereqs.stderr) {
			updateLog(setLog, hasPrereqs.stderr);
		}
    updateLog(setLog, `which git/qmk failed`);
    setFlashState(FlashState.ERROR, "Couldn't find git or qmk (required for Atyu)");
    return setAppReadyState(AppReadyState.NOT_READY);
  }

  setAppReadyState(AppReadyState.LOADING);
  setFlashState(FlashState.RUNNING_SETUP, "Replacing any existing installations");

    // Delete old wmk files here. Stops the bug where 'qmk setup' will repeatedly install 
		// nested 'qmk_firmware' folders. Also assures clean installs.
	updateLog(setLog, `Deleting old ${atyuQmkDir} if it exists`);
	const rmAndMkDirQmkDir = await shellRun(`rm -rf ${atyuQmkDir}`);
	if (!rmAndMkDirQmkDir.success) {
		updateLog(setLog, "There was an issue with removing the old qmk directory");
		updateLog(setLog, `You can try manually deleting ${atyuQmkDir} instead`);
		setFlashState(FlashState.ERROR, "Couldn't remove old Atyu QMK files");
	}

  // Setup atude/qmk_firmware
  setFlashMessage("Downloading and setting up Atyu QMK (this can take a few minutes)");
  const setupQmkCmd = shell.exec(
    `qmk clone atude/qmk_firmware ${atyuQmkDir}`,
    shellExecOptions
  );

  setupQmkCmd.stdout?.on("data", (data: any) => updateLog(setLog, data.toString()));
  setupQmkCmd.stderr?.on("data", (data: any) => updateLog(setLog, data.toString()));
  setupQmkCmd.on("close", (code: any) => {
    updateLog(setLog, `Finished with code ${Number(code)}`);
    if (Number(code) === 0) {
      updateLog(setLog, "Successfully ran setup qmk (using atude/qmk_firmware)");

      // Do a test build using `satisfaction75`
      setFlashMessage(
        "Verifying installation by building test firmware (this can *also* take a few minutes)"
      );
      const testBuildCmd = shell.exec(
        `cd ${atyuQmkDir} && qmk compile -kb cannonkeys/satisfaction75/rev1 -km via`,
        shellExecOptions
      );
      testBuildCmd.stdout?.on("data", (data: any) => updateLog(setLog, data.toString()));
      testBuildCmd.stderr?.on("data", (data: any) => updateLog(setLog, data.toString()));
      testBuildCmd.on("close", (code: any) => {
        updateLog(setLog, `Finished with code ${Number(code)}`);
        if (Number(code) === 0) {
          setFlashState(FlashState.DONE);
          updateLog(setLog, "Successfully built test firmware [satisfaction75]");
					runVerify(appContext);
        } else {
          setFlashState(FlashState.ERROR, "Failed to build test firmware");
        }
      });
    } else {
      setFlashState(FlashState.ERROR, "Failed to setup atude/qmk_firmware environment");
    }
  });
};

export default runSetup;
